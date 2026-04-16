#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { readExif } from './exif.js';
import { exifToFrontmatter } from './frontmatter.js';
import { directoryWalk } from './helpers/directorywalker.js';


async function processFile(file: string, outDir: string) {
	// Read exif
	const exif = await readExif(file);
	// Title from filename
	const base = path.basename(file);
	const title = base.replace(path.extname(base), '');

	// Slug from title
	const slug = title.replace(/\s+/g, '-');

	// Build yaml
	const yaml = exifToFrontmatter(exif, { title: title });

	// Create MDX.
	const mdx = `---\n${yaml.trim()}\n---\n\n`;

	// Create the files!
	const outPath = path.join(outDir, `${slug}.mdx`);
	fs.writeFileSync(outPath, mdx, 'utf8');
	// We should get some monoring in place at some point. 
	console.log(`Created: ${outPath}`);

}


async function main() {

	const input = process.argv[2];
	if (!input) {
		// No file.
		console.error('Usage: exif2fm <file-or-directory>');
		process.exit(1);
	}

	try {
		// If output does not exist, create it. 
		const outDir = path.join(process.cwd(), 'output');
		if (!fs.existsSync(outDir)) {
			fs.mkdirSync(outDir);
		}

		// What kind of input are we handling.
		const stat = fs.statSync(input);

		// Directory logic.
		if (stat.isDirectory()) {
			// Let's do some recursion! 
			for (const file of directoryWalk(input)) {
				// Only process img files. 
				if (/\.(jpg|jpeg|png|tif|tiff|dng)$/i.test(file)) {
					await processFile(file, outDir);
				}
			}
		} else {
			// Process file.
			await processFile(input, outDir);
		}

	} catch (err) {
		// Catch error
		console.error('Error:', err);
		process.exit(1);
	}

	// Mark process as successful
	process.exit(0);
}

main();