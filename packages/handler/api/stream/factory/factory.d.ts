import type { Context } from 'aws-lambda';
import type { ResponseStream, Factory, HandlerParams } from '../types.js';
export declare const getResponseStream: <Event>(args: HandlerParams<Event>) => ResponseStream;
export declare const getContext: <Event>(args: HandlerParams<Event>) => Context;
export declare const factory: Factory;
