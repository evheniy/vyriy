import { getConfig, Parser } from '@vyriy/config';
import { timeout as error } from '@vyriy/timeout';
import { factory } from '../factory.js';
export const withTimeout = factory(async (handler) => {
    const timeout = getConfig('TIMEOUT', 0, Parser.duration);
    if (timeout) {
        await Promise.race([handler(), error(timeout)]);
    }
    else {
        await handler();
    }
});
