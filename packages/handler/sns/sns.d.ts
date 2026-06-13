import type { SNSEvent } from 'aws-lambda';
import type { Decorator, EventHandlerOptions } from '../types.js';
export declare const createSns: (options?: EventHandlerOptions<SNSEvent>) => Decorator<SNSEvent, void>;
export declare const sns: Decorator<SNSEvent, void>;
