import fs from "fs";
import path from "path";
import appPaths from "../../config/appPaths";
import FileServer from "../../src/scripts/fileServer";

test("file transfer", () => {
	const server = new FileServer("localhost", 9393);
	server.listen();
	expect(server.listening).toBeTruthy();
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
	expect(fs.existsSync(testFilePath)).toBeTruthy();
	expect(fs.existsSync(testFilePath2)).toBeFalsy();
	expect(server.defaultDir).toBe("./");
	const testDirPath = path.join(
		appPaths.appDirectory,
		"__tests__",
		"_testResources"
	);
	server.defaultDir = testDirPath;
	expect(server.defaultDir).toBe(testDirPath);
	server.sendFile("localhost", 9393, testFilePath, () => {
		expect(fs.existsSync(testFilePath2)).toBeTruthy();
		fs.unlinkSync(testFilePath2);
		expect(fs.existsSync(testFilePath2)).toBeFalsy();
	});
	server.close();
	expect(server.listening).toBeFalsy();
});
