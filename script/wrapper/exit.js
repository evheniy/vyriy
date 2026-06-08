import { factory } from '../factory.js';
export const withExit = factory(async (handler) => {
    try {
        await handler();
        process.exit(0);
    }
    catch {
        process.exit(1);
    }
});
