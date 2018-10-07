import FileServer from "./fileServer";
import * as Logger from "./utils/Logger";

const LOOGER = Logger.getLogger();
// tslint:disable-next-line:no-console
// console.log("Starting");
const server = new FileServer("localhost", 9595);
// tslint:disable-next-line:no-console
// console.log("Created");
// tslint:disable-next-line:no-console
//console.log("listening");

export function testFile() {
	//tslint:disable-next-line:no-console
	server.listen();
	LOOGER.info(`Server state is: ${server.listening}`);
	// LOOGER.info("server listening");
	//const file = ipcRenderer.sendSync("test");
	//server.sendFile("localhost", 9595, file);
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
