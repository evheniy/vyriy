import { exec as processExec } from 'node:child_process';
import { promisify } from 'node:util';
import { createLogger } from '@vyriy/logger';
const promiseExec = promisify(processExec);
export const exec = async (cmd, options = {}, showLogs = true) => {
    const logger = showLogs ? createLogger() : null;
    if (logger) {
        logger.log(cmd);
        logger.log('Command is starting...');
    }
    const { stdout, stderr } = await promiseExec(cmd, {
        maxBuffer: Infinity,
        ...options,
        encoding: 'utf8',
    });
    if (logger) {
        logger.log(stdout);
        logger.log(stderr);
        logger.log('Command is finished');
    }
    return stdout;
};
