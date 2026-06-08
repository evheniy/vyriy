import { withExit } from './wrapper/exit.js';
import { withError } from './wrapper/error.js';
import { withLogger } from './wrapper/logger.js';
import { withTimeout } from './wrapper/timeout.js';
import { compose } from './compose.js';
export const script = compose(withExit(), withError(), withLogger(), withTimeout());
