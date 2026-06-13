import type { Context } from 'aws-lambda';
import type { ErrorOptions } from './wrappers/error.js';
import type { LoggerOptions } from './wrappers/logger.js';
export type { Context } from 'aws-lambda';
export type * from './api/types.js';
export type { Api as HttpApi, ApiOptions as HttpApiOptions, Compose as HttpCompose, Decorator as HttpDecorator, Factory as HttpFactory, Handler as HttpHandler, HandlerParams as HttpHandlerParams, Wrapper as HttpWrapper, } from './api/http/types.js';
export type { HealthcheckOptions as HttpHealthcheckOptions } from './api/http/wrappers/healthcheck.js';
export type { Api as StreamApi, ApiOptions as StreamApiOptions, Compose as StreamCompose, Decorator as StreamDecorator, Factory as StreamFactory, Handler as StreamHandler, HandlerParams as StreamHandlerParams, ResponseStream, TypedWrapper as StreamTypedWrapper, Wrapper as StreamWrapper, } from './api/stream/types.js';
export type { StreamMetadata } from './api/stream/wrappers/stream.js';
export type HandlerParams<Event> = [event: Event, context: Context];
export type Response<Result> = Promise<Result>;
export type Handler<Event, Result> = (event: Event, context: Context) => Response<Result>;
export type Decorator<Event, Result> = (handler: Handler<Event, Result>) => Handler<Event, Result>;
export type EventHandlerOptions<Event> = {
    error?: ErrorOptions<HandlerParams<Event>>;
    logger?: LoggerOptions;
};
export type Compose = <Event, Result>(...decorators: Array<Decorator<Event, Result>>) => Decorator<Event, Result>;
export type Wrapper<Options> = <Event, Result>(handler: Handler<Event, Result>, args: HandlerParams<Event>, options?: Options) => Response<Result>;
export type TypedWrapper<Event, Result, Options> = (handler: Handler<Event, Result>, args: HandlerParams<Event>, options?: Options) => Response<Result>;
export type Factory = {
    <Options = undefined>(wrapper: Wrapper<Options>): <Event, Result>(options?: Options) => Decorator<Event, Result>;
    <Options, Event, Result>(wrapper: TypedWrapper<Event, Result, Options>): (options?: Options) => Decorator<Event, Result>;
};
