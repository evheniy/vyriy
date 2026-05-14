import type { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult } from 'aws-lambda';
export type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
export type RouteResult = {
    body: APIGatewayProxyResult['body'];
    headers?: APIGatewayProxyResult['headers'];
    isBase64Encoded?: APIGatewayProxyResult['isBase64Encoded'];
    multiValueHeaders?: APIGatewayProxyResult['multiValueHeaders'];
    statusCode?: APIGatewayProxyResult['statusCode'];
};
export type ResponseStream = {
    end: {
        (): unknown;
        (chunk: string | Buffer | Uint8Array): unknown;
    };
    setContentType?: (contentType: string) => unknown;
    writableEnded?: boolean;
    write(chunk: string | Buffer | Uint8Array): unknown;
};
export type HandlerParams = {
    query?: APIGatewayProxyEventQueryStringParameters;
    body?: string;
    headers?: APIGatewayProxyEvent['headers'];
    pathParameters?: APIGatewayProxyEvent['pathParameters'];
    responseStream?: ResponseStream;
    event: APIGatewayProxyEvent;
};
export type Handler = (params: HandlerParams) => Promise<RouteResult | void>;
export type RouterApi = {
    get(path: string, handler: Handler): RouterApi;
    post(path: string, handler: Handler): RouterApi;
    put(path: string, handler: Handler): RouterApi;
    delete(path: string, handler: Handler): RouterApi;
    fallback(handler: Handler): RouterApi;
    patch(path: string, handler: Handler): RouterApi;
    prefix(pathPrefix: string, handler: Handler): RouterApi;
    route(event: APIGatewayProxyEvent, responseStream?: ResponseStream): Promise<RouteResult | void>;
};
