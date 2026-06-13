import { createLogger } from '@vyriy/logger';
import { factory } from '../factory/index.js';
export const withLogger = factory(async (handler, args, options = {}) => {
    const { logger = createLogger() } = options;
    const [request, response] = args;
    logger.info('Request:', request.method, request.url);
    const cleanup = () => {
        response.off('close', logResult);
        response.off('finish', logResult);
    };
    const logResult = () => {
        cleanup();
        logger.info('Result:', response.statusCode);
    };
    response.once('close', logResult);
    response.once('finish', logResult);
    try {
        await handler(...args);
    }
    catch (error) {
        cleanup();
        if (error instanceof Error) {
            logger.error('Error:', error.message);
        }
        logger.error(error);
        throw error;
    }
});
