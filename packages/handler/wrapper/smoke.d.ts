import type { Context, Decorator, HandlerArgs } from '../types.js';
export declare const withSmoke: <Event, Result, Args extends HandlerArgs = [context: Context]>() => Decorator<Event, Result, Args>;
