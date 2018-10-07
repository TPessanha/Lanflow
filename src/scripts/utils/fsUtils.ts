import fs from "fs";
import path from "path";

/**
 * Finds an unused name it uses Windows convention of appending
 * a counter to the name example: "testFile - (1).pfd", until an unused name is found.
 *
 * @param {string} filePath The full path of the file.
 * @returns {Promise<string>} A Promise with the new full path to use.
 */
export function getUnusedName(filePath: string): Promise<string> {
	return new Promise((resolve, reject) => {
		try {
			const originalFilePath = filePath;
			const fDir = path.dirname(originalFilePath);
			const fExtension = path.extname(originalFilePath);
			const fName = path.basename(originalFilePath, fExtension);

			let counter = 1;
			fs.readdir(fDir, (err, files) => {
				while (files.includes(path.basename(filePath))) {
					filePath = path.format({
						dir: fDir,
						name: `${fName} - (${counter++})`,
						ext: fExtension
					});
				}
				resolve(filePath);
			});
		} catch (error) {
			reject(error);
		}
	});
}
