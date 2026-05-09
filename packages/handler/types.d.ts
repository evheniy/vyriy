import type { Context } from 'aws-lambda';
export type { Context } from 'aws-lambda';
export type Response<Result> = Promise<Result>;
export type Handler<Event, Result> = (event: Event, context: Context) => Response<Result>;
export type Decorator<Event, Result> = (handler: Handler<Event, Result>) => Handler<Event, Result>;
export type Compose = <Event, Result>(...decorators: Array<Decorator<Event, Result>>) => Decorator<Event, Result>;
export type Wrapper<Options> = <Event, Result>(handler: Handler<Event, Result>, args: [event: Event, context: Context], options?: Options) => Response<Result>;
export type TypedWrapper<Event, Result, Options> = (handler: Handler<Event, Result>, args: [event: Event, context: Context], options?: Options) => Response<Result>;
export type Factory = {
    <Options = undefined>(wrapper: Wrapper<Options>): <Event, Result>(options?: Options) => Decorator<Event, Result>;
    <Options, Event, Result>(wrapper: TypedWrapper<Event, Result, Options>): (options?: Options) => Decorator<Event, Result>;
};
