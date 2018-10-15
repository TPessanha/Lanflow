/* eslint-disable no-console */
const chalk = require("chalk");
const glob = require("glob");
const DtsCreator = require("typed-css-modules");
const path = require("path");

const creator = new DtsCreator();

glob("src/**/*.scss", {}, (error, filePaths) => {
	for (const filePath of filePaths) {
		//Check if its a partial
		if (path.basename(filePath)[0] != "_") {
			creator
				.create(filePath)
				.then(content => {
					content.writeFile();
					console.log(`${chalk.green("Wrote:")} ${filePath}.d.ts`);
				})
				.catch(error => console.log(chalk.red(error)));
		}
	}
});
