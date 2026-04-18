import { stringify } from 'yaml';
import { ExifData } from './exif.js';
import { thumbnail } from 'exifr';

export function exifToFrontmatter(
	exif: ExifData,
	overrides: Record<string, unknown> = {}
): string {
	const location =
		exif.latitude && exif.longitude
			? [`${exif.latitude}, ${exif.longitude}`]
			: [];

	const fm: Record<string, unknown> = {

		title: overrides.title ?? '',
		pubDate: overrides.pubDate ?? new Date().toISOString(),
		updatedDate: overrides.updatedDate,
		createdDate: exif.createdDate?.toISOString(),

		make: exif.make,
		model: exif.model,
		orientation: exif.orientation,

		exposureTime: exif.exposureTime,
		fNumber: exif.fNumber,
		iso: exif.iso,

		lensInfo: exif.lensInfo,
		lensMake: exif.lensMake,
		lensModel: exif.lensModel,

		location,
		locationName: overrides.locationName,

		image: overrides.image,
		preview: overrides.preview,
		thumbnail: overrides.preview
	};

	// Remove undefined fields
	Object.keys(fm).forEach(
		key => fm[key] === undefined && delete fm[key]
	);

	return stringify(fm);
}
