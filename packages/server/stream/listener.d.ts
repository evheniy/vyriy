import type { NativeRequestListener } from '../types.js';
import type { LambdaHandler } from './types.js';
export declare const listener: (handler: LambdaHandler) => NativeRequestListener;
