const colors = {
	reset: "\x1b[0m",
	orange: "\x1b[38;2;242;143;63m"
};

export function createSpinner(text: string) {
	// Set frames
	const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

	let i = 0;

	const interval = setInterval(() => {
		const frame = frames[i = (i + 1) % frames.length];
		process.stdout.write(
			`\r${colors.orange}${frame} ${text}${colors.reset}`
		);
	}, 80);

	return {
		stop(success = true) {
			clearInterval(interval);
			const symbol = success ? "✔" : "✖";
			process.stdout.write(
				`\r${colors.orange}${symbol} ${text}${colors.reset}\n`
			);
		}
	};
}