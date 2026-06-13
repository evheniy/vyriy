import type { SQSEvent } from 'aws-lambda';
import type { Decorator, EventHandlerOptions } from '../types.js';
export declare const createSqs: (options?: EventHandlerOptions<SQSEvent>) => Decorator<SQSEvent, void>;
export declare const sqs: Decorator<SQSEvent, void>;
