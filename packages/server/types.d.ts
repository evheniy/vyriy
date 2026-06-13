import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import type { IncomingHttpHeaders, OutgoingHttpHeaders, Server as HttpServer } from 'node:http';
export type { Context } from 'aws-lambda';
export type Headers = OutgoingHttpHeaders;
export type LambdaEvent = APIGatewayProxyEvent;
export type LambdaResult = APIGatewayProxyResult;
export type LambdaHandler = (event: LambdaEvent, context: Context) => Promise<LambdaResult>;
export type RequestMessage = {
    headers: IncomingHttpHeaders;
    method?: string;
    url?: string;
    on(event: 'close', listener: () => void): RequestMessage;
    on(event: 'data', listener: (chunk: Buffer | string) => void): RequestMessage;
    on(event: 'end', listener: () => void): RequestMessage;
    on(event: 'error', listener: (error: unknown) => void): RequestMessage;
};
export type ResponseMessage = {
    end: {
        (): ResponseMessage;
        (chunk: string | Buffer | Uint8Array): ResponseMessage;
    };
    writableEnded?: boolean;
    headersSent?: boolean;
    setContentType?: (contentType: string) => ResponseMessage;
    setHeader?(name: string, value: number | string | readonly string[]): ResponseMessage;
    write(chunk: string | Buffer | Uint8Array): boolean;
    writeHead(statusCode: number, headers?: OutgoingHttpHeaders): ResponseMessage;
};
export type ErrorEventTarget = {
    on(event: 'error', listener: (error: Error) => void): ErrorEventTarget;
};
export type NativeRequestListener<Request = RequestMessage, Response = ResponseMessage> = (request: Request, response: Response) => void;
export type GetBody = (request: RequestMessage) => Promise<string | undefined>;
export type MapParams = (request: RequestMessage) => Promise<{
    event: LambdaEvent;
    context: Context;
}>;
export type Server = HttpServer<typeof import('node:http').IncomingMessage, typeof import('node:http').ServerResponse>;
export type Listen = (server: Server) => Server;
export type NormalizeHeaders = (headers: IncomingHttpHeaders) => Record<string, string | undefined>;
export type WriteResult<Response extends ResponseMessage = ResponseMessage> = (response: Response, result: LambdaResult | void) => Promise<void> | void;
export type WriteError<Response extends ResponseMessage = ResponseMessage> = (response: Response) => void;
export type CreateServer = (handler: LambdaHandler) => Server;
