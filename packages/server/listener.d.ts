import type { IncomingMessage, ServerResponse } from 'node:http';
import type { HttpHandler, LambdaHandler, LambdaStreamHandler, NativeRequestListener } from './types.js';
export declare const listener: (handler: LambdaHandler) => NativeRequestListener;
export declare const streamListener: (handler: LambdaStreamHandler) => NativeRequestListener;
export declare const httpListener: (handler: HttpHandler) => NativeRequestListener<IncomingMessage, ServerResponse>;
