import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";
import Logger from "./scripts/utils/Logger";

const logFolder = path.join(app.getPath("logs"));
const LOGGER = Logger.getLogger(logFolder);
LOGGER.info("Started");

let mainWindow: BrowserWindow | null;

function createWindow() {
	mainWindow = new BrowserWindow({
		show: false,
		height: 600,
		width: 800,
		icon: path.join(__dirname, "..", "build", "favicon.ico"),
		webPreferences: {
			devTools: false
		}
	});
	mainWindow.once("ready-to-show", () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}
		mainWindow.show();
		mainWindow.focus();
	});

	const indexPath = url.format({
		pathname: path.join(__dirname, "index.html"),
		protocol: "file:",
		slashes: true
	});
	mainWindow.loadURL(indexPath);

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on("test", (event: any) => {
	// tslint:disable-next-line:no-console
	LOGGER.debug("testtsdt");
	event.returnValue = "pong";
});
