import pkg from 'exifr';
const { parse } = pkg;

import { warn, error, success } from './cli/cliOutputParser.js';


export interface ExifData {
	make?: string;
	model?: string;
	orientation?: string;
	exposureTime?: number;
	fNumber?: number;
	iso?: number;
	lensInfo?: string;
	lensMake?: string;
	lensModel?: string;
	latitude?: number;
	longitude?: number;
	createdDate?: Date;
}

export async function readExif(path: string): Promise<ExifData> {

	// get exif data.
	const exif = await parse(path);

	// No data. 
	if (!exif) {
		warn(`No EXIF data found in ${path}`);
		return {}; // nothing to do
	}

	// Return EXIF Data. 
	return {
		make: exif.Make,
		model: exif.Model,
		orientation: exif.Orientation?.toString(),
		exposureTime: typeof exif.ExposureTime === 'number' ? exif.ExposureTime : undefined,
		fNumber: typeof exif.FNumber === 'number' ? exif.FNumber : undefined,
		iso: typeof exif.ISO === 'number' ? exif.ISO : undefined,
		lensInfo: exif.LensInfo ? String(exif.LensInfo) : undefined,
		lensMake: exif.LensMake,
		lensModel: exif.LensModel,
		latitude: exif.latitude,
		longitude: exif.longitude,
		createdDate: exif.DateTimeOriginal ?? exif.CreateDate
	};


}
