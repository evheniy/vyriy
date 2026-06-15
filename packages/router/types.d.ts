import type { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult } from 'aws-lambda';
export type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
type MaybePromise<Result> = Result | Promise<Result>;
export type RouteResult = APIGatewayProxyResult;
export type RouteHandlerResult = {
    body: APIGatewayProxyResult['body'];
    headers?: APIGatewayProxyResult['headers'];
    isBase64Encoded?: APIGatewayProxyResult['isBase64Encoded'];
    multiValueHeaders?: APIGatewayProxyResult['multiValueHeaders'];
    statusCode?: APIGatewayProxyResult['statusCode'];
};
export type HandlerParams = {
    query?: APIGatewayProxyEventQueryStringParameters;
    body?: string;
    headers?: APIGatewayProxyEvent['headers'];
    pathParameters?: APIGatewayProxyEvent['pathParameters'];
    event: APIGatewayProxyEvent;
};
export type Handler = (params: HandlerParams) => MaybePromise<RouteHandlerResult>;
export type RouterHandler = (event: APIGatewayProxyEvent) => Promise<RouteResult>;
export type RouterApi = {
    all(path: string, handler: Handler): RouterApi;
    get(path: string, handler: Handler): RouterApi;
    handle(): RouterHandler;
    post(path: string, handler: Handler): RouterApi;
    put(path: string, handler: Handler): RouterApi;
    delete(path: string, handler: Handler): RouterApi;
    fallback(handler: Handler): RouterApi;
    patch(path: string, handler: Handler): RouterApi;
    route(event: APIGatewayProxyEvent): Promise<RouteResult>;
};
