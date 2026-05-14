import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
export type { Context } from 'aws-lambda';
export type ResponseStream = {
    end: {
        (): unknown;
        (chunk: string | Buffer | Uint8Array): unknown;
    };
    setContentType?: (contentType: string) => unknown;
    writableEnded?: boolean;
    write(chunk: string | Buffer | Uint8Array): unknown;
};
export type StreamWriter = (responseStream: ResponseStream) => Promise<void> | void;
export type StreamResult = Omit<Partial<APIGatewayProxyResult>, 'body'> & {
    stream: StreamWriter;
    body?: never;
};
export type StaticFileResult = Omit<Partial<APIGatewayProxyResult>, 'body'> & {
    filePath: string;
    body?: never;
};
export type ApiResult = APIGatewayProxyResult | StaticFileResult | StreamResult;
export type ApiEvent = APIGatewayProxyEvent;
export type HandlerArgs = [...args: unknown[], context: Context];
export type HandlerParams<Event, Args extends HandlerArgs = [context: Context]> = [event: Event, ...args: Args];
export type Response<Result> = Promise<Result>;
export type Handler<Event, Result, Args extends HandlerArgs = [context: Context]> = (event: Event, ...args: Args) => Response<Result>;
export type Decorator<Event, Result, Args extends HandlerArgs = [context: Context]> = (handler: Handler<Event, Result, Args>) => Handler<Event, Result, Args>;
export type Compose = <Event, Result, Args extends HandlerArgs = [context: Context]>(...decorators: Array<Decorator<Event, Result, Args>>) => Decorator<Event, Result, Args>;
export type Wrapper<Options> = <Event, Result, Args extends HandlerArgs = [context: Context]>(handler: Handler<Event, Result, Args>, args: HandlerParams<Event, Args>, options?: Options) => Response<Result>;
export type TypedWrapper<Event, Result, Options, Args extends HandlerArgs = [context: Context]> = (handler: Handler<Event, Result, Args>, args: HandlerParams<Event, Args>, options?: Options) => Response<Result>;
export type Factory = {
    <Options = undefined>(wrapper: Wrapper<Options>): <Event, Result, Args extends HandlerArgs = [context: Context]>(options?: Options) => Decorator<Event, Result, Args>;
    <Options, Event, Result, Args extends HandlerArgs = [context: Context]>(wrapper: TypedWrapper<Event, Result, Options, Args>): (options?: Options) => Decorator<Event, Result, Args>;
};
