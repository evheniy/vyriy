import type { ApiResult, Decorator } from '../types.js';
export declare const withSmoke: <Event, Result extends ApiResult | void = ApiResult>() => Decorator<Event, Result>;
