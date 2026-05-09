import { URL } from 'node:url';
import { getBody } from './body.js';
export const normalizeHeaders = (headers) => Object.fromEntries(Object.entries(headers).map(([key, value]) => [
    key,
    Array.isArray(value) ? value.join(', ') : value,
]));
const mapQuery = (url) => {
    const queryStringParameters = {};
    const multiValueQueryStringParameters = {};
    url.searchParams.forEach((value, key) => {
        queryStringParameters[key] = value;
        multiValueQueryStringParameters[key] = [...(multiValueQueryStringParameters[key] ?? []), value];
    });
    return { multiValueQueryStringParameters, queryStringParameters };
};
const createContext = () => ({
    awsRequestId: 'local',
    callbackWaitsForEmptyEventLoop: false,
    done: () => undefined,
    fail: () => undefined,
    functionName: 'local',
    functionVersion: '$LATEST',
    getRemainingTimeInMillis: () => 30000,
    invokedFunctionArn: 'local',
    logGroupName: 'local',
    logStreamName: 'local',
    memoryLimitInMB: '128',
    succeed: () => undefined,
});
export const mapParams = async (request) => {
    const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
    const { multiValueQueryStringParameters, queryStringParameters } = mapQuery(url);
    const headers = normalizeHeaders(request.headers);
    const body = await getBody(request);
    return {
        event: {
            body: body ?? null,
            headers,
            httpMethod: request.method?.toUpperCase() ?? 'GET',
            isBase64Encoded: false,
            multiValueHeaders: Object.fromEntries(Object.entries(headers).map(([key, value]) => [key, value ? [value] : []])),
            multiValueQueryStringParameters,
            path: url.pathname,
            pathParameters: null,
            queryStringParameters,
            requestContext: {},
            resource: url.pathname,
            stageVariables: null,
        },
        context: createContext(),
    };
};
