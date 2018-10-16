// import winston = require("winston");
const path = require("path");
const remote = require("electron").remote;
const winston = require("winston");

const out = {
	/**
	 * Creates a logger and attach it to global
	 * if LogPath is not provided get the logger form electron main process with fallback to standard console.
	 * @param {string} logPath The path where to save the logs.
	 * @returns {winston.Logger} The logger instance to be used.
	 */
	getLogger: (logPath = null) => {
		if (logPath == null) {
			if (remote === undefined) {
				return console;
			}
			return remote.getGlobal("LOGGER");
		}

		const isDev = process.env.NODE_ENV === "development";

		const transports = [
			new winston.transports.File({
				filename: path.join(
					logPath,
					isDev ? "error-dev.log" : "error.log"
				),
				level: "warn"
			}),
			new winston.transports.File({
				filename: path.join(
					logPath,
					isDev ? "combined-dev.log" : "combined.log"
				)
			})
		];
		const logCustomFormat = winston.format.printf(info => {
			if (info.level.length >= 17) {
				return `${info.level}: ${info.message} - (${info.timestamp})`;
			} else {
				return `${info.level}:\t ${info.message} - (${info.timestamp})`;
			}
		});

		if (isDev) {
			transports.push(
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.colorize(),
						logCustomFormat
					),
					level: "silly"
				})
			);
		}

		const LOGGER = winston.createLogger({
			level: "info",
			format: winston.format.combine(
				winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:SSS" }),
				winston.format.splat(),
				winston.format.json()
			),
			transports
		});
		winston.addColors({
			silly: "grey",
			debug: "green",
			verbose: "yellow",
			info: "cyan",
			warn: "blue",
			error: "red"
		});

		global.LOGGER = LOGGER;
		return LOGGER;
	}
};

module.exports = out;
