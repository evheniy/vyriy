import { compose } from './compose.js';
import { withError } from './wrapper/error.js';
import { withLogger } from './wrapper/logger.js';
import { withTimeout } from './wrapper/timeout.js';
import { withContext } from './wrapper/context.js';
import { withSmoke } from './wrapper/smoke.js';
import { withHealthcheck } from './wrapper/healthcheck.js';
import { withHeaders } from './wrapper/headers.js';
import { withCors } from './wrapper/cors.js';
import { withChaos } from './wrapper/chaos.js';
export const api = compose(withError(), withLogger(), withTimeout(), withContext(), withSmoke(), withHealthcheck(), withHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Api-Key, Accept, User-Agent, X-CSRF-Token',
    'Content-Type': 'application/json',
    'X-Robots-Tag': 'noindex, nofollow',
}), withCors(), withChaos());
