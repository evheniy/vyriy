import { factory } from '../factory.js';
export const withCors = factory(async (handler, args) => {
    const [request] = args;
    if (request.httpMethod === 'OPTIONS') {
        return {
            body: '',
            statusCode: 204,
        };
    }
    return handler(...args);
});
