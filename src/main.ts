import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";
import winston from "winston";

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

	const indexPath = url.format({
		pathname: path.join(__dirname, "index.html"),
		protocol: "file:",
		slashes: true
	});
	mainWindow.loadURL(indexPath);

	mainWindow.webContents.on("did-finish-load", () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}
		mainWindow.show();
		mainWindow.focus();
	});

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}

const logFolder = path.join(app.getPath("userData"), "..", "Lanflow", "logs");

const LOGGER = winston.createLogger({
	level: "info",
	format: winston.format.json(),
	transports: [
		//
		// - Write to all logs with level `info` and below to `combined.log`
		// - Write all logs error (and below) to `error.log`.
		//
		new winston.transports.File({
			filename: path.join(logFolder, "error.log"),
			level: "error"
		}),
		new winston.transports.File({
			filename: path.join(logFolder, "combined.log")
		})
	]
});

LOGGER.info("Started");

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
