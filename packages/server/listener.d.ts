import type { LambdaHandler, LambdaStreamHandler, NativeRequestListener } from './types.js';
export declare const listener: (handler: LambdaHandler) => NativeRequestListener;
export declare const streamListener: (handler: LambdaStreamHandler) => NativeRequestListener;
