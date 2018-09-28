/* tslint:disable no-console */
import fs from "fs";
import net from "net";

interface IConnectionTransfer {
	fileSize: number;
	checksum: number;
	writer: fs.WriteStream | null;
}

interface ISocketFileHeaderMessage {
	fileSize: number;
	fileName: string;
	checksum: number;
}
/**
 * File server class is the server part of the file transfer implementation,
 * To use create a new FileServer and run listening
 */
export default class FileServer {
	//Vars
	private server: net.Server;

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

	//connection.writer = fs.createWriteStream("", { fd });
	private createServer(): net.Server {
		const server = net.createServer(socket => {
			let isPiped = false;
			let header = Buffer.alloc(0);

			const stats: IConnectionTransfer = {
				fileSize: 0,
				checksum: 0,
				writer: null
			};

			socket.on("data", buffer => {
				console.log("Reading");
				if (!isPiped) {
					try {
						header = Buffer.concat(
							[header, buffer],
							header.length + buffer.length
						);
						if (header.length < 2) {
							return;
						}

						const headerSize = header.readInt16BE(0);

						if (header.length === headerSize) {
							const json = JSON.parse(
								header.slice(2).toString()
							) as ISocketFileHeaderMessage;

							stats.fileSize = json.fileSize;
							stats.checksum = json.checksum;

							const fd = fs.openSync(json.fileName, "ax");
							stats.writer = fs.createWriteStream("", { fd });
							socket.pipe(stats.writer);
							socket.write(new Buffer([0]));
							isPiped = true;
						}
					} catch (error) {
						socket.destroy();
						if (error.code === "EEXIST") {
							throw new Error("File already exists");
						} else {
							throw error;
						}
					}
				}
			});

			socket.on("end", () => {
				if (
					stats.writer != null &&
					stats.fileSize === stats.writer.bytesWritten &&
					stats.fileSize > 0
				) {
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

		server.on("close", () => console.log("Server closed"));

		return server;
	}
}
