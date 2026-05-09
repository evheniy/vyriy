import { networkInterfaces } from 'node:os';
import { createLogger } from '@vyriy/logger';
export const logListening = (address) => {
    const logger = createLogger();
    Object.values(networkInterfaces())
        .flat()
        .forEach((details) => {
        if (details?.family === 'IPv4') {
            logger.warn(`http://${details.address}:${address.port}/`);
        }
    });
};
export const logError = (label, value) => {
    const logger = createLogger();
    logger.error(label);
    logger.error(value);
};
