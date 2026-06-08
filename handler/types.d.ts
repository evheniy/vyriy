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
export type ApiResult = APIGatewayProxyResult;
export type ApiEvent = APIGatewayProxyEvent;
export type HandlerParams<Event> = [event: Event, context: Context];
export type StreamHandlerParams<Event> = [event: Event, responseStream: ResponseStream, context: Context];
export type Response<Result> = Promise<Result>;
export type Handler<Event, Result> = (event: Event, context: Context) => Response<Result>;
export type StreamHandler<Event> = (event: Event, responseStream: ResponseStream, context: Context) => Response<void>;
export type Decorator<Event, Result> = (handler: Handler<Event, Result>) => Handler<Event, Result>;
export type StreamDecorator<Event> = (handler: StreamHandler<Event>) => StreamHandler<Event>;
export type Compose = <Event, Result>(...decorators: Array<Decorator<Event, Result>>) => Decorator<Event, Result>;
export type StreamCompose = <Event>(...decorators: Array<StreamDecorator<Event>>) => StreamDecorator<Event>;
export type Wrapper<Options> = <Event, Result>(handler: Handler<Event, Result>, args: HandlerParams<Event>, options?: Options) => Response<Result>;
export type StreamWrapper<Options> = <Event>(handler: StreamHandler<Event>, args: StreamHandlerParams<Event>, options?: Options) => Response<void>;
export type TypedWrapper<Event, Result, Options> = (handler: Handler<Event, Result>, args: HandlerParams<Event>, options?: Options) => Response<Result>;
export type StreamTypedWrapper<Event, Options> = (handler: StreamHandler<Event>, args: StreamHandlerParams<Event>, options?: Options) => Response<void>;
export type Factory = {
    <Options = undefined>(wrapper: Wrapper<Options>): <Event, Result>(options?: Options) => Decorator<Event, Result>;
    <Options, Event, Result>(wrapper: TypedWrapper<Event, Result, Options>): (options?: Options) => Decorator<Event, Result>;
};
export type StreamFactory = {
    <Options = undefined>(wrapper: StreamWrapper<Options>): <Event>(options?: Options) => StreamDecorator<Event>;
    <Options, Event>(wrapper: StreamTypedWrapper<Event, Options>): (options?: Options) => StreamDecorator<Event>;
};
