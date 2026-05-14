import { compose, streamCompose } from './compose.js';
import { streamWithApiError, withApiError } from './wrapper/error.js';
import { streamWithLogger, withLogger } from './wrapper/logger.js';
import { streamWithTimeout, withTimeout } from './wrapper/timeout.js';
import { streamWithContext, withContext } from './wrapper/context.js';
import { streamWithSmoke, withSmoke } from './wrapper/smoke.js';
import { streamWithHealthcheck, withHealthcheck } from './wrapper/healthcheck.js';
import { streamWithHeaders, withHeaders } from './wrapper/headers.js';
import { streamWithCors, withCors } from './wrapper/cors.js';
import { streamWithChaos, withChaos } from './wrapper/chaos.js';
export const api = compose(withApiError(), withLogger(), withTimeout(), withContext(), withSmoke(), withHealthcheck(), withHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Api-Key, Accept, User-Agent, X-CSRF-Token',
    'Content-Type': 'application/json',
    'X-Robots-Tag': 'noindex, nofollow',
}), withCors(), withChaos());
export const streamApi = streamCompose(streamWithApiError(), streamWithLogger(), streamWithTimeout(), streamWithContext(), streamWithSmoke(), streamWithHealthcheck(), streamWithHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Api-Key, Accept, User-Agent, X-CSRF-Token',
    'Content-Type': 'application/json',
    'X-Robots-Tag': 'noindex, nofollow',
}), streamWithCors(), streamWithChaos());
