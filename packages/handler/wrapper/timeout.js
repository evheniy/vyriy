import { timeout as error } from '@vyriy/timeout';
import { factory, getContext } from '../factory.js';
export const withTimeout = factory(async (handler, args) => Promise.race([
    error(getContext(args).getRemainingTimeInMillis() - 1000),
    handler(...args),
]));
