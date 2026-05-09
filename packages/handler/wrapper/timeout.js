import { timeout as error } from '@vyriy/timeout';
import { factory } from '../factory.js';
export const withTimeout = factory(async (handler, args) => Promise.race([
    error(args[1].getRemainingTimeInMillis() - 1000),
    handler(...args),
]));
