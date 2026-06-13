import { compose } from '../compose/index.js';
import { withChaos } from './wrappers/chaos.js';
import { withCors } from './wrappers/cors.js';
import { withApiError } from './wrappers/error.js';
import { withHealthcheck } from './wrappers/healthcheck.js';
import { withHeaders } from './wrappers/headers.js';
import { withContext } from '../wrappers/context.js';
import { withLogger } from '../wrappers/logger.js';
import { withSmoke } from '../wrappers/smoke.js';
import { withTimeout } from '../wrappers/timeout.js';
export const API_HEADERS = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'access-control-allow-headers': 'Content-Type, Authorization, X-Requested-With, X-Api-Key, Accept, User-Agent, X-CSRF-Token',
    'content-type': 'application/json',
    'x-robots-tag': 'noindex, nofollow',
};
export const createApi = (options = {}) => compose(withApiError(options.error), withLogger(options.logger), withTimeout(), withContext(), withSmoke(), withHealthcheck(options.healthcheck), withHeaders(options.headers ?? API_HEADERS), withCors(), withChaos(options.chaos));
export const api = createApi();
