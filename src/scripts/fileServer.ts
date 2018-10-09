import fs from "fs";
import net from "net";
import path from "path";
import { generateHash } from "./utils/cryptoUtil";
import { getUnusedName } from "./utils/fsUtils";
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

interface IFileServerOptions {
	defaultDir: string;
}
/**
 * File transfer implementation server and client,
 * To use create a new FileServer and run listening if you want to receive,
 * use the sendFile if you want to send.
 */
export default class FileServer extends net.Server {
	private options: IFileServerOptions = {
		defaultDir: path.normalize("./") //TODO get this form settings
	};

	constructor(
		options?: {
			allowHalfOpen?: boolean;
			pauseOnConnect?: boolean;
			defaultDir?: string;
		},
		connectionListener?: (socket: net.Socket) => void
	) {
		super(options, connectionListener);
		if (options && options.defaultDir) {
			this.options.defaultDir = options.defaultDir;
		}
		this.setupFileServer();
	}

	get defaultDir(): string {
		return this.options.defaultDir;
	}
	set defaultDir(newDefaultdir: string) {
		if (path.isAbsolute(newDefaultdir)) {
			this.options.defaultDir = path.normalize(newDefaultdir);
			LOGGER.debug(`New defaultDir is: ${this.options.defaultDir}`);
		} else {
			throw new Error("New path must be absolute.");
		}
	}
	/**
	 * Sends a file located at 'filePath' to using 'host:port'.
	 * The server doesn't need to be listenning to send files.
	 *
	 * @param {string} host The host
	 * @param {number} port The port
	 * @param {string} filePath The path to the file
	 */
	public sendFile(
		host: string,
		port: number,
		filePath: string,
		callback?: () => void
	) {
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
					readStream.on("end", () => {
						client.end();
						if (callback) {
							callback();
						}
					});
				}
			});
			client.on("end", () => {
				LOGGER.info("disconnected from server");
			});
		});
	}

	/**
	 * Adds the needed listeners for a new TCP server ready to receive files.
	 */
	private setupFileServer() {
		this.on("connection", socket => {
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
				LOGGER.debug("Data received");
				if (this.readSocketFileHeader(data, stats)) {
					try {
						stats.header.contentName = await getUnusedName(
							stats.header.contentName,
							this.options.defaultDir
						);

						fs.open(stats.header.contentName, "ax", (err, fd) => {
							if (err) {
								socket.write(Buffer.from([1]));
								throw err;
							}
							stats.writer = fs.createWriteStream("", {
								fd
							});

							LOGGER.debug(
								"Pipe the incoming file to streamWriter"
							);
							// tslint:disable-next-line:no-console
							console.log("sdgsd");
							socket.pipe(stats.writer);
							socket.removeListener("data", onData);
							socket.write(Buffer.from([0]));
						});
					} catch (error) {
						throw error;
					}
				}
			};

			socket.on("data", onData);

			socket.on("end", () => {
				// tslint:disable-next-line:no-console
				console.log("sdgsd");
				LOGGER.debug(
					`Check if file is received file: ${
						stats.header.contentName
					}`
				);
				const exits = fs.existsSync(stats.header.contentName);
				LOGGER.debug(`Does the file exist: ${String(exits)}`);
				fs.readFile(stats.header.contentName, (err, data) => {
					const checksum = generateHash(data, "md5", "hex");

					if (checksum === stats.header.checksum) {
						LOGGER.info("Received file");
					} else {
						LOGGER.warn("File corrupted");
					}
					if (stats.writer !== null) {
						stats.writer.end();
						stats.writer.close();
					}
					LOGGER.debug("Connection ended");
				});
			});
		});

		this.on("close", () => LOGGER.debug("Server closed"));
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

			stats.header.contentName = path.join(
				this.options.defaultDir,
				stats.header.contentName
			);
			return true;
		}
		return false;
	}
}
