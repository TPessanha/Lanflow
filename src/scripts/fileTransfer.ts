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

	private JsonParse(str: string): any {
		try {
			return JSON.parse(str);
		} catch (e) {
			return null;
		}
	}

	//connection.writer = fs.createWriteStream("", { fd });
	private createServer(): net.Server {
		const server = net.createServer(socket => {
			const stats: IConnectionTransfer = {
				fileSize: 0,
				checksum: 0,
				writer: null
			};
			socket.on("data", buffer => {
				// tslint:disable-next-line:no-console
				console.log("Reading");

				try {
					const json = this.JsonParse(
						buffer.toString()
					) as ISocketFileHeaderMessage;
					if (json != null) {
						stats.fileSize = json.fileSize;
						stats.checksum = json.checksum;

						const fd = fs.openSync(json.fileName, "ax");
						stats.writer = fs.createWriteStream("", { fd });
						socket.pipe(stats.writer);
						socket.write(new Buffer([0]));
					}
				} catch (error) {
					socket.destroy();
					if (error.code === "EEXIST") {
						throw new Error("File already exists");
					} else {
						throw error;
					}
				}
			});

			socket.on("end", () => {
				if (
					stats.writer != null &&
					stats.fileSize === stats.writer.bytesWritten &&
					stats.fileSize > 0
				) {
					// tslint:disable-next-line:no-console
					console.log("Received file");
				} else {
					// tslint:disable-next-line:no-console
					console.log("File corrupted");
				}
				if (stats.writer !== null) {
					stats.writer.end();
					socket.end();
				}
				stats.writer = null;
				stats.checksum = 0;
				stats.fileSize = 0;

				// tslint:disable-next-line:no-console
				console.log("ended");
			});
		});

		server.on("close", () => {
			// tslint:disable-next-line:no-console
			console.log("Server closed");
		});

		return server;
	}
}
