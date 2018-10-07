import { generateHash } from "../../../src/scripts/utils/cryptoUtil";

test("The string to be hashed with MD5", () => {
	expect(generateHash("testn1", "md5", "hex")).toBe(
		"023618ea91ddedd2267c291af760f0c3"
	);
	expect(generateHash("testn2", "md5", "hex")).toBe(
		"769ec57c5106b427b4a8692c35872f43"
	);
});
