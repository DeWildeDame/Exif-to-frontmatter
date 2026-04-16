#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { ExifData, readExif } from './exif.js';
import { exifToFrontmatter } from './frontmatter.js';
import { directoryWalk } from './helpers/directorywalker.js';

// Create tracker for slug override
let _slugCount = 0;


// Add support for arguments. 
function parseArgs(argv: string[]) {
	// Get args
	const args: Record<string, string> = {};

	// Create new override.
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		// only look for items leading with --
		if (arg.startsWith("--")) {
			const key = arg.slice(2);
			const value = argv[i + 1] && !argv[i + 1].startsWith("--")
				? argv[++i]
				: "true";

			args[key] = value;
		}
	}

	return args;
}


async function processExif(exif: ExifData, flags: Record<string, any>) {
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


// The props keep growing and growing. 
async function processFile(file: string, inputRoot: string, outDir: string, flags: Record<string, any>) {

	// Read exif.
	const exif = await readExif(file);

	// Process overrides.
	processExif(exif, flags);


	// Title from filename
	const base = path.basename(file);
	const title = base.replace(path.extname(base), '');

	// Slug from title with respecting the overrides.
	// This code is bad right now, move it to a new process to handle directory and slug handling.

	const slug = flags.slug ? flags.slug + ++_slugCount : title.replace(/\s+/g, '-');

	// Build yaml, respect override from te flags.
	const yaml = exifToFrontmatter(exif, { title: flags.title ? flags.title : title });

	// Create MDX.
	const mdx = `---\n${yaml.trim()}\n---\n\n`;

	// Create target directory
	const rel = path.relative(inputRoot, file);
	const relDir = path.dirname(rel);

	const targetDir = path.join(outDir, relDir);
	fs.mkdirSync(targetDir, { recursive: true });

	// Create the files!
	const outPath = path.join(targetDir, `${slug}.mdx`);
	fs.writeFileSync(outPath, mdx, 'utf8');
	// We should get some monotoring in place at some point. 
	console.info(`Created: ${outPath}`);

}


async function main() {
	// Process input
	let input = process.argv[2];

	// Capture arguments
	const flags = parseArgs(process.argv.slice(3));

	// Capture input path
	const inputRoot = input ? path.resolve(input) : 'input';

	try {

		// Always remove output.
		const outDir = path.join(process.cwd(), 'output');
		if (fs.existsSync(outDir)) {
			fs.rmSync(outDir, { recursive: true, force: true });
		}
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

	} catch (err) {
		// Catch error
		console.error('Error:', err);
		process.exit(1);
	}

	// Mark process as successful
	process.exit(0);
}

main();