import { remote } from "electron";
import FileServer from "./fileServer";
import * as Logger from "./utils/Logger";

const LOGGER = Logger.getLogger();
const server = new FileServer();
// tslint:disable-next-line:no-console
// console.log("Starting");
//testFile();
// tslint:disable-next-line:no-console
// console.log("Created");
// tslint:disable-next-line:no-console
//console.log("listening");
export function closeServer() {
	server.close();
}

export function testFile() {
	//tslint:disable-next-line:no-console
	LOGGER.info(`Server runing: ${server.listening}`);
	if (server.listening) {
		sendFile();
	} else {
		server.listen(9595, "localhost");
	}
	// LOOGER.info("server listening");

	//console.log(ipcRenderer.sendSync("open-file", "ping"));
	// remote.dialog.showOpenDialog(
	// 	{
	// 		properties: ["openFile"]
	// 	},
	// 	files => {
	// 		if (files !== undefined) {
	// 			//server.sendFile("localhost", 9595, files[0]);
	// 			// tslint:disable-next-line:no-console
	// 			console.log({ files });
	// 		}
	// 	}
	// );
}

function sendFile() {
	LOGGER.debug("Open dialog in main process");
	remote.dialog.showOpenDialog(
		{
			properties: ["openFile"]
		},
		files => {
			if (files !== undefined) {
				LOGGER.info(`Send: ${files}`);
				server.sendFile("localhost", 9595, files[0]);
			} else {
				LOGGER.debug(`Canceled file transfer`);
			}
		}
	);
}
