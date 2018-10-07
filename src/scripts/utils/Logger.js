// import winston = require("winston");
const path = require("path");
const remote = require("electron").remote;
const winston = require("winston");

const out = {
	/**
	 * Creates a logger and attach it to global
	 * if LogPath is not provided get the logger form electron main process.
	 * @param {string} logPath The path where to save the logs.
	 * @returns {winston.Logger} The logger instance to be used.
	 */
	getLogger: (logPath = null) => {
		if (logPath == null) {
			return remote.getGlobal("LOGGER");
		}

		const isDev = process.env.NODE_ENV === "development";

		const transports = [
			new winston.transports.File({
				filename: path.join(
					logPath,
					isDev ? "error-dev.log" : "error.log"
				),
				level: "error"
			}),
			new winston.transports.File({
				filename: path.join(
					logPath,
					isDev ? "combined-dev.log" : "combined.log"
				)
			})
		];

		if (isDev) {
			transports.push(
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.colorize(),
						winston.format.timestamp({
							format: "YYYY-MM-DD HH:mm:ss:SSS"
						}),
						winston.format.simple()
					),
					level: "debug"
				})
			);
		}

		const LOGGER = winston.createLogger({
			level: "info",
			format: winston.format.combine(
				winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:SSS" }),
				winston.format.json()
			),
			transports
		});
		winston.addColors({
			error: "red",
			warn: "yellow",
			info: "cyan",
			debug: "green"
		});

		global.LOGGER = LOGGER;
		return LOGGER;
	}
};

module.exports = out;
