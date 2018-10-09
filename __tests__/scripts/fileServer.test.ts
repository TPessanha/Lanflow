import fs from "fs";
import path from "path";
import appPaths from "../../config/appPaths";
import FileServer from "../../src/scripts/fileServer";

test("tmpTestToFixAppveyor", () => {
	const testFilePath = path.join(
		appPaths.appDirectory,
		"__tests__",
		"_testResources",
		"testFile.txt"
	);
	expect(fs.existsSync(testFilePath)).toBeTruthy();
	fs.readFile(testFilePath, (err, data) => {
		expect(data.length).toBeGreaterThan(2);
	});
});

test("file transfer", () => {
	const testFilePath = path.join(
		appPaths.appDirectory,
		"__tests__",
		"_testResources",
		"testFile.txt"
	);
	const testFilePath2 = path.join(
		appPaths.appDirectory,
		"__tests__",
		"_testResources",
		"testFile - (1).txt"
	);
	const dirPath = path.dirname(testFilePath);
	const server = new FileServer();
	server.defaultDir = dirPath;

	expect(fs.existsSync(testFilePath)).toBeTruthy();
	expect(server.defaultDir).toBe(dirPath);

	server.listen(9393, "localhost", () => {
		server.sendFile("localhost", 9393, testFilePath, () => {
			server.close(() => {
				// tslint:disable-next-line:no-debugger
				expect(fs.existsSync(testFilePath2)).toBeTruthy();
				fs.unlinkSync(testFilePath2);
				expect(fs.existsSync(testFilePath2)).toBeFalsy();
			});
		});
	});

	// expect(server.listening).toBeFalsy();
});
