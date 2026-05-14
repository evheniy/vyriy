import type { Context } from 'aws-lambda';
import type { Factory, HandlerArgs, HandlerParams } from './types.js';
export declare const getContext: <Event, Args extends HandlerArgs>(args: HandlerParams<Event, Args>) => Context;
export declare const factory: Factory;
