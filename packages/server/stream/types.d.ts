import type { Context } from 'aws-lambda';
import type { ResponseStream } from '@vyriy/handler';
import type { LambdaEvent, Server } from '../types.js';
export type LambdaHandler = (event: LambdaEvent, responseStream: ResponseStream, context: Context) => Promise<void>;
export type CreateServer = (handler: LambdaHandler) => Server;
