import { createLogger } from '@vyriy/logger';
import { factory, getContext, getStreamContext, httpFactory, streamFactory } from '../factory.js';
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
export const streamWithLogger = streamFactory(async (handler, args, options = {}) => {
    const { logger = createLogger() } = options;
    const [event] = args;
    const context = getStreamContext(args);
    logger.info('Event:', event);
    logger.info('Context:', context);
    try {
        await handler(...args);
        logger.info('Result:', undefined);
    }
    catch (error) {
        if (error instanceof Error) {
            logger.error('Error:', error.message);
        }
        logger.error(error);
        throw error;
    }
});
export const httpWithLogger = httpFactory(async (handler, args, options = {}) => {
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
