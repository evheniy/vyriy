import type { IncomingMessage, ServerResponse } from 'node:http';
import type { NativeRequestListener } from '../types.js';
import type { Handler } from './types.js';
export declare const listener: (handler: Handler) => NativeRequestListener<IncomingMessage, ServerResponse>;
