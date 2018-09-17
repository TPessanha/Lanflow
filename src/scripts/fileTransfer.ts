import net from "net";

export default class FileServer {
	//ReadOnly
	private readonly PORT: number;
	private readonly HOST: string;
	//Vars
	private _running: boolean;
	private server: net.Server | null;

	public constructor(HOST: string, PORT: number) {
		this._running = false;
		this.server = null;
		this.PORT = PORT;
		this.HOST = HOST;
	}

	get running(): boolean {
		return this._running;
	}

	public start() {
		if (!this.server && !this.running) {
			this._running = true;
			this.server = this.createServer();
			this.server.listen(this.PORT, this.HOST);
		} else {
			throw new Error(`Server already running`);
		}
	}

	public stop() {
		if (this.server) {
			this._running = false;
			this.server.close();
			this.server = null;
		}
	}

	private createServer(): net.Server {
		const server = net.createServer(socket => {
			socket.setEncoding("utf8");

			socket.on("data", data => {
				// tslint:disable-next-line:no-console
				console.log(`data received: ${data}`);
			});
		});

		return server;
	}

	// server = net.createServer(socket => {
	// 	// tslint:disable-next-line:no-console
	// 	console.log(`CONNECTED: ${socket.remoteAddress}:${socket.remotePort}`);

	// 	socket.setEncoding("utf8");

	// 	socket.on("data", data => {
	// 		// tslint:disable-next-line:no-console
	// 		console.log("data received");
	// 		// tslint:disable-next-line:no-console
	// 		console.log("data is: " + data);
	// 	});
	// });

	// const HOST = "127.0.0.1";
	// //const FILEPATH = "/home/steve/Downloads/";

	// server.listen(PORT, HOST);
}
