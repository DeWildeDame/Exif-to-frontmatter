#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { ExifData, readExif } from './exif.js';
import { exifToFrontmatter } from './frontmatter.js';
import { directoryWalk } from './helpers/directorywalker.js';
import parseArgs from './helpers/parseArgs.js';
import processExif from './helpers/processExif.js';
import processImages from './helpers/processImages.js';

import { warn, error, success } from './cli/cliOutputParser.js';

import { createSpinner } from './cli/spinner.js';

// Create tracker for slug override
let _slugCount = 0;

// The props keep growing and growing. 
async function processFile(file: string, inputRoot: string, outDir: string, flags: Record<string, any>) {

	// Create a spinner class. 
	const spinner = createSpinner(`Processing ${file}`);


	try {
		// Read exif.
		const exif = await readExif(file) as Record<string, any>;;

		if (!exif || Object.keys(exif).length === 0) {
			spinner.stop(false);
			warn(`No EXIF data found in ${file}`);
			return;
		}

		// Title from filename
		const base = path.basename(file);
		const title = base.replace(path.extname(base), '');


		// Slug from title with respecting the overrides.
		// This code is bad right now, move it to a new process to handle directory and slug handling.
		let slug = flags.slug ? flags.slug + ++_slugCount : title.replace(/\s+/g, '-');

		// Normalize.
		slug = slug.toLowerCase();

		// Set a new base for images
		const publicBase = `/assets/img/photos/${path}/${slug}`;
		const imagepaths = {
			image: `${publicBase}.jpg`,
			preview: `${publicBase}-preview.jpg`,
			thumbnail: `${publicBase}-48x.jpg`
		}

		const rel = path.relative(inputRoot, file);
		const relDir = path.dirname(rel);

		// Split up up MDX files and images
		const mdxRoot = path.join(outDir, "mdx");
		const imgRoot = path.join(outDir, "img");

		fs.mkdirSync(mdxRoot, { recursive: true });
		fs.mkdirSync(imgRoot, { recursive: true });

		flags.image = imagepaths.image;
		flags.preview = imagepaths.preview;
		flags.thumbnail = imagepaths.thumbnail;

		flags.title = title;
		// Process overrides.
		processExif(exif, flags);

		// Build yaml, respect override from te flags.
		const yaml = exifToFrontmatter(exif, flags);

		// Create MDX.
		const mdx = `---\n${yaml.trim()}\n---\n\n`;

		// Create target directory
		const targetDirMdx = path.join(mdxRoot, relDir);
		fs.mkdirSync(targetDirMdx, { recursive: true });

		// Create the files!
		const outPath = path.join(targetDirMdx, `${slug}.mdx`);
		fs.writeFileSync(outPath, mdx, 'utf8');


		const targetDirImg = path.join(imgRoot, relDir);
		// Process images.
		await processImages(file, targetDirImg, slug);

		spinner.stop(true);

		// We should get some monotoring in place at some point. 
		success(`Created: ${outPath}`);
	} catch (err: any) {
		spinner.stop(false);
		warn(` Failed to process ${file}: ${err.message || err}`)
	}

}


async function main() {

	// Process input
	let input = process.argv[2];

	// Capture input path and replace if needed
	if (typeof input === 'undefined' || input.startsWith('--'))
		input = 'input';

	const inputRoot = input;

	// Capture arguments
	const flags = parseArgs(process.argv.slice(3));



	try {


		// Always remove output.
		const outDir = path.join(process.cwd(), 'output');


		// Remove if out put exists. 
		if (fs.existsSync(outDir)) {
			fs.rmSync(outDir, { recursive: true, force: true });
		}

		// Create new empty output folder
		fs.mkdirSync(outDir, { recursive: true });


		// What kind of input are we handling.
		const stat = fs.statSync(input);

		// Directory logic.
		if (stat.isDirectory()) {

			// Let's do some recursion!
			for (const file of directoryWalk(input)) {

				// Only process img files. 
				if (/\.(jpg|jpeg|png|tif|tiff|dng)$/i.test(file)) {
					await processFile(file, inputRoot, outDir, flags);
				}
			}
		} else {
			// Process file.
			await processFile(input, inputRoot, outDir, flags);
		}

	} catch (err: any) {
		// Catch error
		warn(err);
		process.exit(1);
	}

	// Mark process as successful
	process.exit(0);
}

main();