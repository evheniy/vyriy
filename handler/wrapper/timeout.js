import { timeout as error } from '@vyriy/timeout';
import { factory, getContext, getStreamContext, streamFactory } from '../factory.js';
export const withTimeout = factory(async (handler, args) => Promise.race([
    error(getContext(args).getRemainingTimeInMillis() - 1000),
    handler(...args),
]));
export const streamWithTimeout = streamFactory(async (handler, args) => Promise.race([
    error(getStreamContext(args).getRemainingTimeInMillis() - 1000),
    handler(...args),
]));
