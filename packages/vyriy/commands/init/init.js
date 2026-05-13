import path from 'node:path';
import { cwd as getCwd } from 'node:process';
import { runNewCommand } from '../new/index.js';
export const runInitCommand = async ({ cwd = getCwd(), ...options } = {}) => runNewCommand({
    ...options,
    projectName: path.basename(cwd),
});
