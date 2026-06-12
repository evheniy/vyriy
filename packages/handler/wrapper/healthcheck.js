import { STATUS_CODES } from 'node:http';
import { factory, httpFactory, streamFactory } from '../factory.js';
import { responseStream } from './stream.js';
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
export const streamWithHealthcheck = streamFactory(async (handler, args, options = {}) => {
    const [event, stream] = args;
    const result = await getHealthcheckResult(event, options);
    if (result) {
        responseStream(stream, { statusCode: result.statusCode }).end(result.body);
        return;
    }
    await handler(...args);
});
export const httpWithHealthcheck = httpFactory(async (handler, args, options = {}) => {
    const { path = '/healthcheck', action, body } = options;
    const [request, response] = args;
    const pathname = (request.url ?? '').split('?')[0];
    if (pathname !== path) {
        await handler(...args);
        return;
    }
    if (action) {
        await action();
    }
    response
        .writeHead(200, {
        'content-type': 'application/json',
    })
        .end(JSON.stringify(body ?? { message: STATUS_CODES[200] }));
});
