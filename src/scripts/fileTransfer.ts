/* tslint:disable no-console */
import fs from "fs";
import net from "net";
import path from "path";
import { generateHash } from "./utils/cryptoUtil";

/**
 * Interface for a helper connection object containing information for a file transfer
 */
interface IFileTransfer {
	buffer: Buffer;
	header: IFileHeader;
	writer: fs.WriteStream | null;
	reader: fs.ReadStream | null;
}
/**
 * Interface for a file header, contains info about the file itself.
 */
interface IFileHeader {
	checksum: string;
	contentLength: number;
	contentName: string;
}
/**
 * File server class is the server part of the file transfer implementation,
 * To use create a new FileServer and run listening
 */
export default class FileServer {
	get listening(): boolean {
		return this.server.listening;
	}
	//Vars
	private server: net.Server;

	/**
	 * Constructor for the FileServer class.
	 *
	 * @param HOST The host to listen on.
	 * @param PORT The port to listen on.
	 */
	public constructor(
		private readonly HOST: string,
		private readonly PORT: number
	) {
		this.server = this.createServer();
	}

	/**
	 * Start listening for connections
	 */
	public listen() {
		if (!this.server.listening) {
			this.server.listen(this.PORT, this.HOST);
		} else {
			throw new Error(`Server already running`);
		}
	}

	/**
	 * Prevents new connections, existing connections will remain active.
	 */
	public close() {
		if (this.server) {
			this.server.close();
		}
	}

	/**
	 * Receive the File Header form the connection and write it to stats.
	 *
	 * @param socket The socket the data is being read from
	 * @param data The new data received
	 * @param stats The connection info
	 * @return returns true if header is fully read, false otherwise
	 */
	private readSocketFileHeader(data: Buffer, stats: IFileTransfer): boolean {
		stats.buffer = Buffer.concat(
			[stats.buffer, data],
			stats.buffer.length + data.length
		);

		if (
			stats.buffer.length >= 2 &&
			stats.buffer.length === stats.buffer.readInt16BE(0)
		) {
			const json = JSON.parse(
				stats.buffer.slice(2).toString()
			) as IFileHeader;

			stats.header.contentLength = json.contentLength;
			stats.header.checksum = json.checksum;
			stats.header.contentName = json.contentName;
			return true;
		}
		return false;
	}

	/**
	 * Sees if the name is unused if it is use Windows convention of appending
	 *  "copy" and "copy (2)", until an unused name is found.
	 *
	 * @param filePath A string with the full path of the file.
	 * @return A string with the new full path to use.
	 */
	private getUnusedName(filePath: string): string {
		const originalFilePath = filePath;
		const fDir = path.dirname(originalFilePath);
		const fExtension = path.extname(originalFilePath);
		const fName = path.basename(originalFilePath, fExtension);

		//TODO MAKE THIS ASYNC
		let counter = 1;
		while (fs.existsSync(filePath)) {
			filePath = path.format({
				dir: fDir,
				name: `${fName} - Copy${counter === 1 ? "" : `(${counter})`}`,
				ext: fExtension
			});

			counter++;
		}
		return filePath;
	}

	/**
	 * Creates a new TCP server.
	 */
	private createServer(): net.Server {
		const server = net.createServer(socket => {
			//let isPiped = false;

			const stats: IFileTransfer = {
				buffer: Buffer.alloc(0),
				header: {
					checksum: "0",
					contentLength: 0,
					contentName: ""
				},
				reader: null,
				writer: null
			};

			const onData = (data: Buffer) => {
				if (this.readSocketFileHeader(data, stats)) {
					//TODO create a function for opening the file and treat same name error.
					stats.header.contentName = this.getUnusedName(
						stats.header.contentName
					);
					fs.open(stats.header.contentName, "ax", (err, fd) => {
						if (err) {
							throw err;
						}
						stats.writer = fs.createWriteStream("", { fd });

						socket.pipe(stats.writer);
						socket.removeListener("data", onData);
						socket.write(new Buffer([0]));
					});
				}
			};

			socket.on("data", onData);

			socket.on("end", () => {
				fs.readFile(stats.header.contentName, (err, data) => {
					const checksum = generateHash(data, "md5", "hex");

					if (checksum === stats.header.checksum) {
						console.log("Received file");
					} else {
						// tslint:disable-next-line:no-console
						console.log("File corrupted");
					}
					if (stats.writer !== null) {
						stats.writer.end();
						socket.end();
					}
					console.log("ended");
				});
			});
		});

		server.on("close", () => console.log("Server closed"));

		return server;
	}
}
