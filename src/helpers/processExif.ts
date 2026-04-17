import { ExifData } from '../exif.js';

export default async function processExif(exif: ExifData, flags: Record<string, any>) {
	const exifData = exif as Record<string, any>;
	for (const key in exif) {
		if (!(key in flags)) continue;

		const value = flags[key];

		// numeric override (iso, fNumber, exposureBias, etc.)
		if (!isNaN(Number(value))) {
			exifData[key] = Number(value);
			continue;
		}

		// fraction override (exposureTime: "1/6400")
		if (/^\d+\/\d+$/.test(value)) {
			const [num, den] = value.split("/").map(Number);
			exifData[key] = num / den;
			continue;
		}

		// location override (string array)
		if (key === "location") {
			exifData.location = [value];
			continue;
		}

		// default: treat as string
		exifData[key] = value;
	}
};