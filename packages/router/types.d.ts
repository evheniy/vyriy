import type { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult } from 'aws-lambda';
import type { HttpHandler } from '@vyriy/handler';
import type { IncomingMessage, ServerResponse } from 'node:http';
export type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
export type { HttpHandler } from '@vyriy/handler';
type MaybePromise<Result> = Result | Promise<Result>;
export type RouteResult = APIGatewayProxyResult;
export type RouteHandlerResult = {
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
    event: APIGatewayProxyEvent;
};
export type Handler = (params: HandlerParams) => MaybePromise<RouteHandlerResult>;
export type StreamHandler = (params: HandlerParams, responseStream: ResponseStream) => MaybePromise<void>;
export type RouterHandler = (event: APIGatewayProxyEvent) => Promise<RouteResult>;
export type StreamRouterHandler = (event: APIGatewayProxyEvent, responseStream: ResponseStream) => Promise<void>;
export type RouterApi = {
    get(path: string, handler: Handler): RouterApi;
    handle(): RouterHandler;
    post(path: string, handler: Handler): RouterApi;
    put(path: string, handler: Handler): RouterApi;
    delete(path: string, handler: Handler): RouterApi;
    fallback(handler: Handler): RouterApi;
    patch(path: string, handler: Handler): RouterApi;
    route(event: APIGatewayProxyEvent): Promise<RouteResult>;
};
export type StreamRouterApi = {
    get(path: string, handler: StreamHandler): StreamRouterApi;
    handle(): StreamRouterHandler;
    post(path: string, handler: StreamHandler): StreamRouterApi;
    put(path: string, handler: StreamHandler): StreamRouterApi;
    delete(path: string, handler: StreamHandler): StreamRouterApi;
    fallback(handler: StreamHandler): StreamRouterApi;
    patch(path: string, handler: StreamHandler): StreamRouterApi;
    route(event: APIGatewayProxyEvent, responseStream: ResponseStream): Promise<void>;
};
export type HttpRouterApi = {
    all(path: string, handler: HttpHandler): HttpRouterApi;
    get(path: string, handler: HttpHandler): HttpRouterApi;
    handle(): HttpHandler;
    post(path: string, handler: HttpHandler): HttpRouterApi;
    put(path: string, handler: HttpHandler): HttpRouterApi;
    delete(path: string, handler: HttpHandler): HttpRouterApi;
    fallback(handler: HttpHandler): HttpRouterApi;
    patch(path: string, handler: HttpHandler): HttpRouterApi;
    route(request: IncomingMessage, response: ServerResponse): Promise<void>;
};
