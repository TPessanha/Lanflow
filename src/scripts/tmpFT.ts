import path from "path";
import FileServer from "./fileServer";
import * as Logger from "./utils/Logger";

const LOOGER = Logger.getLogger();
const server = new FileServer();
// tslint:disable-next-line:no-console
// console.log("Starting");
//testFile();
// tslint:disable-next-line:no-console
// console.log("Created");
// tslint:disable-next-line:no-console
//console.log("listening");

export function testFile() {
	//tslint:disable-next-line:no-console
	LOOGER.info(`Server state is: ${server.listening}`);
	if (server.listening) {
		LOOGER.warn(`Server listen was called more than once without closing.`);
		server.sendFile(
			"localhost",
			9595,
			path.resolve("./__tests__/_testResources/testFile.txt")
		);
	} else {
		server.defaultDir = path.resolve("./__tests__/_testResources");
		server.listen(9595, "localhost", undefined, () => {
			server.sendFile(
				"localhost",
				9595,
				path.resolve("./__tests__/_testResources/testFile.txt")
			);
		});
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
