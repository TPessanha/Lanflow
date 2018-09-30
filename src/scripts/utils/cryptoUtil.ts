import crypto from "crypto";

/**
 * Small function for convenience to generate a hash of a string|Buffer.
 *
 * @param data A string or a Buffer with the data to be hashed.
 * @param algorithm The algorithm to hash, dependent on OpenSSL.
 * @param encoding The encoding used "latin1" | "hex" | "base64".
 */
export function generateHash(
	data: string | Buffer,
	algorithm = "md5",
	encoding: crypto.HexBase64Latin1Encoding = "hex"
) {
	return crypto
		.createHash(algorithm)
		.update(data)
		.digest(encoding);
}
