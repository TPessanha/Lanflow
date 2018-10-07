const Logger = require("../../src/scripts/utils/Logger");

Logger.getLogger = jest.fn(() => global.console);
