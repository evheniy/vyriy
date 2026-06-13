import { compose } from '../compose/index.js';
import { withContext } from '../wrappers/context.js';
import { withError } from '../wrappers/error.js';
import { withLogger } from '../wrappers/logger.js';
import { withSmoke } from '../wrappers/smoke.js';
import { withTimeout } from '../wrappers/timeout.js';
export const createDynamodb = (options = {}) => compose(withError(options.error), withLogger(options.logger), withTimeout(), withContext(), withSmoke());
export const dynamodb = createDynamodb();
