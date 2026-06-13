import type { ApiEvent, ApiResult, Decorator, HandlerParams } from '../types.js';
import type { ApiErrorOptions } from '../../wrappers/error.js';
export declare const withApiError: (options?: ApiErrorOptions<HandlerParams<ApiEvent>, ApiResult>) => Decorator<ApiEvent, ApiResult>;
export type { ApiErrorHandler, ApiErrorOptions } from '../../wrappers/error.js';
