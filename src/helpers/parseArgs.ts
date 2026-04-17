// Add support for arguments. 
export default function parseArgs(argv: string[]) {
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