import { exec as processExec } from 'node:child_process';
import { promisify } from 'node:util';
export const exec = promisify(processExec);
