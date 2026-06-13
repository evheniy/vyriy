import type { Context } from 'aws-lambda';
import type { ChaosOptions } from '@vyriy/chaos';
import type { ApiEvent, ApiResult } from '../types.js';
import type { ApiErrorOptions } from '../wrappers/error.js';
import type { HealthcheckOptions } from '../wrappers/healthcheck.js';
import type { Response } from '../../types.js';
import type { LoggerOptions } from '../../wrappers/logger.js';
export type { Context } from 'aws-lambda';
export type { ApiEvent, ApiResult } from '../types.js';
export type ResponseStream = {
    end: {
        (): unknown;
        (chunk: string | Buffer | Uint8Array): unknown;
    };
    setContentType?: (contentType: string) => unknown;
    writableEnded?: boolean;
    write(chunk: string | Buffer | Uint8Array): unknown;
};
export type HandlerParams<Event> = [event: Event, responseStream: ResponseStream, context: Context];
export type Handler<Event> = (event: Event, responseStream: ResponseStream, context: Context) => Response<void>;
export type Decorator<Event> = (handler: Handler<Event>) => Handler<Event>;
export type Compose = <Event>(...decorators: Array<Decorator<Event>>) => Decorator<Event>;
export type Wrapper<Options> = <Event>(handler: Handler<Event>, args: HandlerParams<Event>, options?: Options) => Response<void>;
export type TypedWrapper<Event, Options> = (handler: Handler<Event>, args: HandlerParams<Event>, options?: Options) => Response<void>;
export type Factory = {
    <Options = undefined>(wrapper: Wrapper<Options>): <Event>(options?: Options) => Decorator<Event>;
    <Options, Event>(wrapper: TypedWrapper<Event, Options>): (options?: Options) => Decorator<Event>;
};
export type ApiOptions = {
    chaos?: ChaosOptions;
    error?: ApiErrorOptions<HandlerParams<ApiEvent>, ApiResult | void>;
    healthcheck?: HealthcheckOptions;
    headers?: Record<string, string>;
    logger?: LoggerOptions;
};
export type Api = (options?: ApiOptions) => Decorator<ApiEvent>;
