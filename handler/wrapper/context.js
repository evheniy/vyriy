import { factory, getContext, getStreamContext, streamFactory } from '../factory.js';
export const withContext = factory(async (handler, args) => {
    const ctx = getContext(args);
    ctx.callbackWaitsForEmptyEventLoop = false;
    return handler(...args);
});
export const streamWithContext = streamFactory(async (handler, args) => {
    const ctx = getStreamContext(args);
    ctx.callbackWaitsForEmptyEventLoop = false;
    return handler(...args);
});
