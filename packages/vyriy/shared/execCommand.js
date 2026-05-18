import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
export const execCommand = async (command, args = []) => {
    const { stdout } = await execFileAsync(command, args);
    return stdout.trim();
};
