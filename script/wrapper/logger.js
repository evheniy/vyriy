import { createLogger } from '@vyriy/logger';
import { factory } from '../factory.js';
export const withLogger = factory(async (handler, options = {}) => {
    const { logger = createLogger() } = options;
    logger.info('Task started...');
    try {
        await handler();
        logger.info('Task finished!');
    }
    catch (error) {
        if (error instanceof Error) {
            logger.error('Task error:', error.message);
        }
        logger.error(error);
        throw error;
    }
});
