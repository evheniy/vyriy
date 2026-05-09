import type { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult } from 'aws-lambda';
export type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
export type Result = {
    body: APIGatewayProxyResult['body'];
    headers?: APIGatewayProxyResult['headers'];
    statusCode?: APIGatewayProxyResult['statusCode'];
};
export type HandlerParams = {
    query?: APIGatewayProxyEventQueryStringParameters;
    body?: string;
    headers?: APIGatewayProxyEvent['headers'];
    pathParameters?: APIGatewayProxyEvent['pathParameters'];
    event: APIGatewayProxyEvent;
};
export type Handler = (params: HandlerParams) => Promise<Result | undefined>;
export type RouterApi = {
    get(path: string, handler: Handler): RouterApi;
    post(path: string, handler: Handler): RouterApi;
    put(path: string, handler: Handler): RouterApi;
    delete(path: string, handler: Handler): RouterApi;
    patch(path: string, handler: Handler): RouterApi;
    route(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
};
