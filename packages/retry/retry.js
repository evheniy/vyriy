import { pause } from '@vyriy/pause';
import { createLogger } from '@vyriy/logger';
export const retry = async (handler, options = {}) => {
    const logger = createLogger();
    logger.info('Retry options:', options);
    const { retries = 2, delay = 0 } = options;
    const run = async (attempt = retries) => {
        logger.info('Attempt:', attempt);
        try {
            return await handler();
        }
        catch (error) {
            logger.info('Retry Error:', error.message);
            if (attempt) {
                await pause(delay);
                return run(attempt - 1);
            }
            throw error;
        }
    };
    return run();
};
