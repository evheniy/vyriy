import { smoke } from '@vyriy/smoke';
import { responseStream } from './stream.js';
export const withSmoke = () => (handler) => async (event, context) => {
    const result = smoke(event);
    return (result || (await handler(event, context)));
};
export const streamWithSmoke = () => (handler) => async (event, stream, context) => {
    const result = smoke(event);
    if (result) {
        responseStream(stream, {
            headers: result.headers,
            statusCode: result.statusCode,
        }).end(result.body);
        return;
    }
    await handler(event, stream, context);
};
