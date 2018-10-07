// import winston = require("winston");
import path from "path";
import remote from "electron";
// const winston = require("winston");
import { File, Console, format, createLogger, addColors } from "winston";

/**
 * Creates a logger and attach it to global
 * if LogPath is not provided get the logger form electron main process.
 * @param {string} logPath The path where to save the logs.
 * @returns {winston.Logger} The logger instance to be used.
 */
export function getLogger(logPath = null) {
	if (logPath == null) {
		return remote.getGlobal("LOGGER");
	}

	const isDev = process.env.NODE_ENV === "development";

	const transports = [
		new File({
			filename: path.join(logPath, isDev ? "error-dev.log" : "error.log"),
			level: "error"
		}),
		new File({
			filename: path.join(
				logPath,
				isDev ? "combined-dev.log" : "combined.log"
			)
		})
	];

	if (isDev) {
		transports.push(
			new Console({
				format: format.combine(
					format.colorize(),
					format.timestamp({
						format: "YYYY-MM-DD HH:mm:ss:SSS"
					}),
					format.simple()
				),
				level: "debug"
			})
		);
	}

	const LOGGER = createLogger({
		level: "info",
		format: format.combine(
			format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:SSS" }),
			format.json()
		),
		transports
	});
	addColors({
		error: "red",
		warn: "yellow",
		info: "cyan",
		debug: "green"
	});

	global.LOGGER = LOGGER;
	return LOGGER;
}
