/* eslint-disable no-console */
const chalk = require("chalk");
const glob = require("glob");
const DtsCreator = require("typed-css-modules");

const creator = new DtsCreator();

glob("src/**/*.scss", {}, (error, filePaths) => {
	for (const filePath of filePaths) {
		creator
			.create(filePath)
			.then(content => {
				content.writeFile();
				console.log(`${chalk.green("Wrote:")} ${filePath}.d.ts`);
			})
			.catch(error => console.log(chalk.red(error)));
	}
});
