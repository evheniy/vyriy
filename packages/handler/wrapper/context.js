import { factory } from '../factory.js';
export const withContext = factory(async (handler, args) => {
    const [, ctx] = args;
    ctx.callbackWaitsForEmptyEventLoop = false;
    return handler(...args);
});
