import fs from "fs";
import path from "path";

/**
 * Finds an unused name it uses Windows convention of appending
 * a counter to the name example: "testFile - (1).pfd", until an unused name is found.
 *
 * @param {string} fileName The full path of the file.
 * @returns {Promise<string>} A Promise with the new full path to use.
 */
export function getUnusedName(fileName: string, dir = "./"): Promise<string> {
	return new Promise((resolve, reject) => {
		try {
			const originalFilePath = path.parse(path.resolve(dir, fileName));

			let counter = 1;
			fs.readdir(originalFilePath.dir, (err, files) => {
				while (files.includes(path.basename(fileName))) {
					fileName = path.format({
						dir: originalFilePath.dir,
						name: `${originalFilePath.name} - (${counter++})`,
						ext: originalFilePath.ext
					});
				}
				resolve(fileName);
			});
		} catch (error) {
			reject(error);
		}
	});
}
