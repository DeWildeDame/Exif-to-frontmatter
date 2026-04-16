import fs from 'node:fs';
import path from 'node:path'
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
// Crazy sweet stuff!
export function* directoryWalk(dir: string): Generator<string> {
	// Get dir
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	// Walk through directories
	for (const entry of entries) {

		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			// Recursive.
			yield* directoryWalk(fullPath);
		} else {
			// Output full path.
			yield fullPath;
		}
	}
}
