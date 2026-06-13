import { createLogger } from '@vyriy/logger';
import { factory, getContext } from '../factory/index.js';
export const withLogger = factory(async (handler, args, options = {}) => {
    const { logger = createLogger() } = options;
    const [event] = args;
    const context = getContext(args);
    logger.info('Event:', event);
    logger.info('Context:', context);
    try {
        const result = await handler(...args);
        logger.info('Result:', result);
        return result;
    }
    catch (error) {
        if (error instanceof Error) {
            logger.error('Error:', error.message);
        }
        logger.error(error);
        throw error;
    }
});
