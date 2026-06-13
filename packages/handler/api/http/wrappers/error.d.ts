import type { Decorator, HandlerParams } from '../types.js';
import type { ErrorOptions } from '../../../wrappers/error.js';
export declare const withError: (options?: ErrorOptions<HandlerParams>) => Decorator;
