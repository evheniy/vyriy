import { logger } from './logger.js';
import { LOG_LEVELS } from './levels.js';
const levelWeight = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
};
const isLogLevel = (value) => LOG_LEVELS.includes(value);
const getLogLevel = () => {
    const value = process.env.LOG_LEVEL?.trim().toLowerCase();
    return value && isLogLevel(value) ? value : 'warn';
};
export const createLogger = () => {
    const logLevel = getLogLevel();
    const log = (level, ...messages) => {
        const minWeight = levelWeight[logLevel];
        if (levelWeight[level] >= minWeight) {
            logger[level](...messages);
        }
    };
    return {
        ...logger,
        debug: (...messages) => log('debug', ...messages),
        info: (...messages) => log('info', ...messages),
        log: (...messages) => log('info', ...messages),
        warn: (...messages) => log('warn', ...messages),
        error: (...messages) => log('error', ...messages),
    };
};
