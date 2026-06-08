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
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'access-control-allow-headers': 'Content-Type, Authorization, X-Requested-With, X-Api-Key, Accept, User-Agent, X-CSRF-Token',
    'content-type': 'application/json',
    'x-robots-tag': 'noindex, nofollow',
}), withCors(), withChaos());
export const streamApi = streamCompose(streamWithApiError(), streamWithLogger(), streamWithTimeout(), streamWithContext(), streamWithSmoke(), streamWithHealthcheck(), streamWithHeaders({
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'access-control-allow-headers': 'Content-Type, Authorization, X-Requested-With, X-Api-Key, Accept, User-Agent, X-CSRF-Token',
    'content-type': 'application/json',
    'x-robots-tag': 'noindex, nofollow',
}), streamWithCors(), streamWithChaos());
