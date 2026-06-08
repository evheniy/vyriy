import { networkInterfaces } from 'node:os';
import { createLogger } from '@vyriy/logger';
export const logListening = (address) => {
    const logger = createLogger();
    const hosts = new Set(['localhost']);
    Object.values(networkInterfaces())
        .flat()
        .forEach((details) => {
        if (details?.family === 'IPv4') {
            hosts.add(details.address);
        }
    });
    hosts.forEach((host) => {
        logger.warn(`http://${host}:${address.port}/`);
    });
};
export const logError = (label, value) => {
    const logger = createLogger();
    logger.error(label);
    logger.error(value);
};
