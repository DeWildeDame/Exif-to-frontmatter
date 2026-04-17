import { ExifData } from '../exif.js';

export default async function processExif(exif: ExifData, flags: Record<string, any>) {

	const exifData = exif as Record<string, any>;

	// For loops can be confusing.... 
	for (const key in flags) {

		// Grab value
		const value = flags[key];

		// numeric override (iso, fNumber, exposureBias, etc.)
		if (!isNaN(Number(value))) {
			exifData[key] = Number(value);
			continue;
		}

		// Fraction override (exposureTime: "1/6400")
		if (/^\d+\/\d+$/.test(value)) {
			const [num, den] = value.split("/").map(Number);
			exifData[key] = num / den;
			continue;
		}

		// Location override (string array).
		if (key === "location") {
			exifData.location = [value];
			continue;
		}

		// Default: treat as string.
		exifData[key] = value;
	}


};