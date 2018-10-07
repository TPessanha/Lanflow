import fs from "fs";
import net from "net";
import path from "path";
import { generateHash } from "./utils/cryptoUtil";
import * as Logger from "./utils/Logger";

const LOGGER = Logger.getLogger();
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
 * File transfer implementation server and client,
 * To use create a new FileServer and run listening if you want to receive,
 * use the sendFile if you want to send.
 */
export default class FileServer {
	//Vars
	private server: net.Server;

	/**
	 * Constructor for the FileServer class.
	 *
	 * @param {string} HOST The host to listen on.
	 * @param {number} PORT The port to listen on.
	 */
	public constructor(
		private readonly HOST: string,
		private readonly PORT: number
	) {
		this.server = this.createServer();
	}

	get listening(): boolean {
		return this.server.listening;
	}

	/**
	 * Start listening for connections
	 */
	public listen() {
		LOGGER.debug("Server listening");
		this.server.listen(this.PORT, this.HOST);
	}

	/**
	 * Stops the server from accepting new connections and keeps existing
	 * connections. This function is asynchronous, the server is finally
	 * closed when all connections are ended and the server emits a 'close' event.
	 *
	 * The optional callback will be called once the 'close' event occurs.
	 *
	 * @param {Function} callback Called when the server is closed
	 */
	public close(callback?: () => void) {
		this.server.close(callback);
	}

	/**
	 * Sends a file located at 'filePath' to using 'host:port'.
	 * The server doesn't need to be listenning to send files.
	 *
	 * @param {string} host The host
	 * @param {number} port The port
	 * @param {string} filePath The path to the file
	 */
	public sendFile(host: string, port: number, filePath: string) {
		fs.stat(filePath, (err, stats) => {
			if (err) {
				throw err;
			}
			const name = path.basename(filePath);
			const size = stats.size;
			const client = net.createConnection(port, host);
			client.once("connect", () => {
				fs.readFile(filePath, (_err, data) => {
					if (_err) {
						throw _err;
					}
					const fileHeader = {
						checksum: generateHash(data, "md5", "hex"),
						contentLength: size,
						contentName: name
					} as IFileHeader;
					const bufHeader = Buffer.from(JSON.stringify(fileHeader));
					const bufHeaderSize = Buffer.alloc(2);
					bufHeaderSize.writeUInt16BE(bufHeader.length, 0);
					client.write(bufHeaderSize);
					client.write(bufHeader);
				});
			});
			client.on("data", data => {
				LOGGER.debug(data.toString());
				if (data[0] === 0) {
					const readStream = fs.createReadStream(filePath);
					readStream.pipe(client);
					readStream.on("close", () => {
						client.end();
					});
				}
			});
			client.on("end", () => {
				LOGGER.info("disconnected from server");
			});
		});
	}

	/**
	 * Receive the File Header form the connection and write it to stats.
	 *
	 * @param {Buffer} data The new data received
	 * @param {IFileTransfer} stats The connection info
	 * @returns {boolean} true if header is fully read, false otherwise
	 */
	private readSocketFileHeader(data: Buffer, stats: IFileTransfer): boolean {
		stats.buffer = Buffer.concat(
			[stats.buffer, data],
			stats.buffer.length + data.length
		);

		if (
			stats.buffer.length >= 2 &&
			stats.buffer.length - 2 === stats.buffer.readInt16BE(0)
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
	 * Finds an unused name it uses Windows convention of appending
	 * a counter to the name example: "testFile - (1).pfd", until an unused name is found.
	 *
	 * @param {string} filePath The full path of the file.
	 * @returns {Promise<string>} A Promise with the new full path to use.
	 */
	private getUnusedName(filePath: string): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				const originalFilePath = filePath;
				const fDir = path.dirname(originalFilePath);
				const fExtension = path.extname(originalFilePath);
				const fName = path.basename(originalFilePath, fExtension);

				let counter = 1;
				fs.readdir(fDir, (err, files) => {
					while (files.includes(path.basename(filePath))) {
						filePath = path.format({
							dir: fDir,
							name: `${fName} - (${counter++})`,
							ext: fExtension
						});
					}
					resolve(filePath);
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 * Creates a new TCP server ready to receive files.
	 * @returns {net.Server} The created server.
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

			const onData = async (data: Buffer) => {
				if (this.readSocketFileHeader(data, stats)) {
					try {
						stats.header.contentName = await this.getUnusedName(
							stats.header.contentName
						);

						fs.open(stats.header.contentName, "ax", (err, fd) => {
							if (err) {
								socket.write(new Buffer([1]));
								throw err;
							}
							stats.writer = fs.createWriteStream("", {
								fd
							});

							socket.pipe(stats.writer);
							socket.removeListener("data", onData);
							socket.write(new Buffer([0]));
						});
					} catch (error) {
						throw error;
					}
				}
			};

			socket.on("data", onData);

			socket.on("end", () => {
				fs.readFile(stats.header.contentName, (err, data) => {
					const checksum = generateHash(data, "md5", "hex");

					if (checksum === stats.header.checksum) {
						LOGGER.info("Received file");
					} else {
						LOGGER.warn("File corrupted");
					}
					if (stats.writer !== null) {
						stats.writer.end();
						socket.end();
					}
					LOGGER.debug("Connection ended");
				});
			});
		});

		server.on("close", () => LOGGER.debug("Server closed"));

		return server;
	}
}
