import { InvokeCommand } from '@aws-sdk/client-lambda';
import { createLogger } from '@vyriy/logger';
import { createClient } from './client.js';
export const invoke = async (functionName, payload, options = {}) => {
    const client = createClient();
    const logger = createLogger();
    logger.info('functionName:', functionName);
    logger.info('payload:', payload);
    logger.info('options:', options);
    const input = {
        FunctionName: functionName,
        Payload: new TextEncoder().encode(payload),
        ...options,
    };
    try {
        const result = await client.send(new InvokeCommand(input));
        logger.info('Result:', result);
        return result;
    }
    catch (e) {
        logger.error(e);
        throw e;
    }
};
