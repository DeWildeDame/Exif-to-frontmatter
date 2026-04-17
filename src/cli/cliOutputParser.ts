const colors = {
	reset: "\x1b[0m",
	warn: "\x1b[38;2;242;143;63m",
	error: "\x1b[31m",
	success: "\x1b[32m",
	info: "\x1b[36m"
};

export function warn(msg: string) {
	console.warn(`${colors.warn}${msg}${colors.reset}`);
}

export function error(msg: string) {
	console.error(`${colors.error}${msg}${colors.reset}`);
}

export function success(msg: string) {
	console.log(`${colors.success}${msg}${colors.reset}`);
}