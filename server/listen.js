import { getPort } from '@vyriy/env';
import { toError } from '@vyriy/error';
import { logError, logListening } from './log.js';
import { graceful } from './shutdown.js';
export const listen = (server) => {
    server.on('error', (error) => {
        logError('Server error:', error);
        process.exit(1);
    });
    server.on('request', (request, response) => {
        request.on('error', (error) => {
            logError('Request error:', toError(error));
        });
        response.on('error', (error) => {
            logError('Response error:', error);
        });
    });
    server.on('listening', () => {
        const address = server.address();
        if (address && typeof address !== 'string') {
            logListening(address);
        }
    });
    graceful(server);
    server.listen(Number(getPort()));
    return server;
};
