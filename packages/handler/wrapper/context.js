import { factory, getContext } from '../factory.js';
export const withContext = factory(async (handler, args) => {
    const ctx = getContext(args);
    ctx.callbackWaitsForEmptyEventLoop = false;
    return handler(...args);
});
