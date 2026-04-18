import { appendFile } from "node:fs/promises";

// Wirte to file
const LOG_PATH = "logs/cli.log";

// Log output
async function writeLog(level: string, msg: string) {
	const timestamp = new Date().toISOString();
	const line = `[${timestamp}] [${level.toUpperCase()}] ${msg}\n`;
	await appendFile(LOG_PATH, line);
}

// Colors
const colors = {
	reset: "\x1b[0m",
	warn: "\x1b[38;2;242;143;63m",
	error: "\x1b[31m",
	success: "\x1b[32m",
	info: "\x1b[36m"
};


// Warning colors
export async function warn(msg: string) {
	console.warn(`${colors.warn}${msg}${colors.reset}`);
	await writeLog("warn", msg);
}
// Error. Console error will conveniently jump out of the process 
export async function error(msg: string) {
	await writeLog("error", msg);
	console.error(`${colors.error}${msg}${colors.reset}`);
}

// Success.
export async function success(msg: string) {
	console.log(`${colors.success}${msg}${colors.reset}`);
	await writeLog("success", msg);
}

// Info.
export async function info(msg: string) {
	console.log(`${colors.info}${msg}${colors.reset}`);
	await writeLog("info", msg);
}

