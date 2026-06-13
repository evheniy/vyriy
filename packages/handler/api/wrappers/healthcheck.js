import { STATUS_CODES } from 'node:http';
import { factory } from '../../factory/index.js';
const getHealthcheckResult = async (event, options = {}) => {
    const { path = '/healthcheck', action } = options;
    if (event.path !== path) {
        return undefined;
    }
    if (action) {
        await action();
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: STATUS_CODES[200],
        }),
    };
};
export const withHealthcheck = factory(async (handler, args, options = {}) => {
    const [event] = args;
    const result = await getHealthcheckResult(event, options);
    return result ?? handler(...args);
});
