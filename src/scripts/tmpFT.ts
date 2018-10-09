import fs from "fs";
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
	} else {
		server.listen(9595, "localhost");
	}
	// LOOGER.info("server listening");
	server.sendFile(
		"localhost",
		9595,
		path.resolve(
			fs.realpathSync(process.cwd()),
			"/__tests__/_testResources/testFile.txt"
		)
	);
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
