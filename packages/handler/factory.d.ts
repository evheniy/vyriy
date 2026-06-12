import type { Context } from 'aws-lambda';
import type { Factory, HandlerParams, HttpFactory, ResponseStream, StreamFactory, StreamHandlerParams } from './types.js';
export declare const getContext: <Event>(args: HandlerParams<Event>) => Context;
export declare const getResponseStream: <Event>(args: StreamHandlerParams<Event>) => ResponseStream;
export declare const getStreamContext: <Event>(args: StreamHandlerParams<Event>) => Context;
export declare const factory: Factory;
export declare const streamFactory: StreamFactory;
export declare const httpFactory: HttpFactory;
