import { generateHash } from "../../../src/scripts/utils/cryptoUtil";

test("The string to be hashed with MD5", () => {
	const str1 = "testn1";
	const str2 = "testn2";
	expect(generateHash(str1, "md5", "hex")).toBe(
		"023618ea91ddedd2267c291af760f0c3"
	);
	expect(generateHash(str2, "md5", "hex")).toBe(
		"769ec57c5106b427b4a8692c35872f43"
	);
});
