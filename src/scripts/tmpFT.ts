import FileServer from "./fileTransfer";

// tslint:disable-next-line:no-console
console.log("Starting");
const server = new FileServer("localhost", 9595);
// tslint:disable-next-line:no-console
console.log("Created");
server.listen();
// tslint:disable-next-line:no-console
console.log("listening");
