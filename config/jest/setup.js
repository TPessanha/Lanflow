const Logger = require("../../src/scripts/utils/Logger");
const winston = require("winston");

//We don't want jest to run the Winston logger with file transports.
Logger.getLogger = jest.fn(() => {
	const LOGGER = winston.createLogger({
		level: "info",
		format: winston.format.combine(
			winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:SSS" }),
			winston.format.json()
		),
		transports: [
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
		]
	});

	winston.addColors({
		error: "red",
		warn: "yellow",
		info: "cyan",
		debug: "green"
	});
	return LOGGER;
});
