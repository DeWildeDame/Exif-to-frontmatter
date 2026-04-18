import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises"

export default async function processImages(
	inputFile: string,
	targetDir: string,
	slug: string) {

	// Ensure the directory exists
	await fs.mkdir(targetDir, { recursive: true });

	// Set Base
	const base = path.join(targetDir, slug);

	// 1. Resize longest dimension to 1920
	await sharp(inputFile)
		.resize({ width: 1920, height: 1920, fit: "inside" })
		.jpeg({ quality: 90 })
		.toFile(`${base}.jpg`);

	// 2. Crop to 250x160
	await sharp(inputFile)
		.resize(250, 160, { fit: "cover" })
		.jpeg({ quality: 90 })
		.toFile(`${base}-preview.jpg`);

	// 3. Crop to 48x48
	await sharp(inputFile)
		.resize(48, 48, { fit: "cover" })
		.jpeg({ quality: 90 })
		.toFile(`${base}-48x.jpg`);
}