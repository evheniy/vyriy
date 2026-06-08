import { createLogger } from '@vyriy/logger';
export const shutdown = (server, signal) => {
    const logger = createLogger();
    logger.warn(`Received ${signal}. Closing server...`);
    server.close((error) => {
        if (error) {
            logger.error('Server shutdown error:');
            logger.error(error);
            process.exit(1);
            return;
        }
        logger.warn('Server closed.');
        process.exit(0);
    });
};
export const graceful = (server) => {
    let closing = false;
    ['SIGINT', 'SIGTERM'].forEach((signal) => {
        process.once(signal, () => {
            if (closing) {
                return;
            }
            closing = true;
            shutdown(server, signal);
        });
    });
};
