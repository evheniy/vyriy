import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { ChaosOptions } from '@vyriy/chaos';
import type { Decorator, HandlerParams } from '../types.js';
import type { ApiErrorOptions } from './wrappers/error.js';
import type { HealthcheckOptions } from './wrappers/healthcheck.js';
import type { LoggerOptions } from '../wrappers/logger.js';
export type { Decorator, Handler, HandlerParams } from '../types.js';
export type ApiResult = APIGatewayProxyResult;
export type ApiEvent = APIGatewayProxyEvent;
export type ApiOptions = {
    chaos?: ChaosOptions;
    error?: ApiErrorOptions<HandlerParams<ApiEvent>, ApiResult>;
    healthcheck?: HealthcheckOptions;
    headers?: Record<string, string>;
    logger?: LoggerOptions;
};
export type Api = (options?: ApiOptions) => Decorator<ApiEvent, ApiResult>;
