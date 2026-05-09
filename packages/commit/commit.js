import { readFileSync } from 'node:fs';
import { createLogger } from '@vyriy/logger';
import { path } from '@vyriy/path';
export const commit = ({ rule, error, info }) => {
    const msg = readFileSync(path('.git/COMMIT_EDITMSG'), 'utf8');
    if (!rule.test(msg) && !msg.startsWith('Merge') && !msg.startsWith('Auto-merging')) {
        const logger = createLogger();
        logger.error(error);
        logger.info(info);
        process.exit(1);
    }
};
