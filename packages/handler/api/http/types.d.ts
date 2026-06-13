import type { IncomingMessage, ServerResponse } from 'node:http';
import type { HealthcheckOptions } from './wrappers/healthcheck.js';
import type { Response } from '../../types.js';
import type { ErrorOptions } from '../../wrappers/error.js';
import type { LoggerOptions } from '../../wrappers/logger.js';
export type Handler = (request: IncomingMessage, response: ServerResponse) => Promise<void> | void;
export type HandlerParams = [request: IncomingMessage, response: ServerResponse];
export type Decorator = (handler: Handler) => Handler;
export type Compose = (...decorators: Array<Decorator>) => Decorator;
export type Wrapper<Options> = (handler: Handler, args: HandlerParams, options?: Options) => Response<void>;
export type Factory = <Options = undefined>(wrapper: Wrapper<Options>) => (options?: Options) => Decorator;
export type ApiOptions = {
    error?: ErrorOptions<HandlerParams>;
    healthcheck?: HealthcheckOptions;
    headers?: Record<string, string>;
    logger?: LoggerOptions;
};
export type Api = (options?: ApiOptions) => Decorator;
