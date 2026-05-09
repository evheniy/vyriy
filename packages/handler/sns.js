import { compose } from './compose.js';
import { withError } from './wrapper/error.js';
import { withLogger } from './wrapper/logger.js';
import { withTimeout } from './wrapper/timeout.js';
import { withContext } from './wrapper/context.js';
import { withSmoke } from './wrapper/smoke.js';
export const sns = compose(withError({ throwError: true }), withLogger(), withTimeout(), withContext(), withSmoke());
