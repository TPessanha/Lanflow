import fs from "fs";
import path from "path";
import appPaths from "../../config/appPaths";
import FileServer from "../../src/scripts/fileServer";

test("tmpTestToFixAppveyor", () => {
	const testFilePath = appPaths.appTestFile;
	expect(fs.existsSync(testFilePath)).toBeTruthy();
	fs.readFile(testFilePath, (err, data) => {
		expect(data.length).toBeGreaterThan(2);
	});
});

test("file transfer", () => {
	const testFilePath = appPaths.appTestFile;

	const testFilePath2 = path.join(
		appPaths.appTestResources,
		"testFile - (1).txt"
	);
	const server = new FileServer();
	server.defaultDir = appPaths.appTestResources;

	expect(fs.existsSync(testFilePath)).toBeTruthy();
	expect(server.defaultDir).toBe(appPaths.appTestResources);

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
