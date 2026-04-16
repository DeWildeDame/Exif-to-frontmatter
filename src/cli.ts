#!/usr/bin/env node
import path from 'node:path';
import { readExif } from './exif.js';
import { exifToFrontmatter } from './frontmatter.js';

async function main() {

	const file = process.argv[2];
	if (!file) {
		// No file
		console.error('Usage: exif2fm <image>');
		process.exit(1);
	}

	try {
		// Read Exif
		const exif = await readExif(file);


		// title from filename
		const base = path.basename(file);
		const title = base.replace(path.extname(base), '');

		// Write yaml
		const yaml = exifToFrontmatter(exif, { title });

		console.log('---');
		console.log(yaml.trim());
		console.log('---');

	} catch (err) {
		// Catch error
		console.error('Error:', err);
		process.exit(1);
	}
}

main();