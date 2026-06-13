import { compose } from './compose/index.js';
import { withCors } from './wrappers/cors.js';
import { withError } from './wrappers/error.js';
import { withHeaders } from './wrappers/headers.js';
import { withHealthcheck } from './wrappers/healthcheck.js';
import { withLogger } from './wrappers/logger.js';
const API_HEADERS = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'access-control-allow-headers': 'Content-Type, Authorization, X-Requested-With, X-Api-Key, Accept, User-Agent, X-CSRF-Token',
    'x-robots-tag': 'noindex, nofollow',
};
export const createApi = (options = {}) => compose(withError(options.error), withLogger(options.logger), withHealthcheck(options.healthcheck), withHeaders(options.headers ?? API_HEADERS), withCors());
export const api = createApi();
