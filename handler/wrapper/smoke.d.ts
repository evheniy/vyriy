import type { ApiResult, Decorator, StreamDecorator } from '../types.js';
export declare const withSmoke: <Event, Result extends ApiResult | void = ApiResult>() => Decorator<Event, Result>;
export declare const streamWithSmoke: <Event>() => StreamDecorator<Event>;
