import type { DynamoDBStreamEvent } from 'aws-lambda';
import type { Decorator, EventHandlerOptions } from '../types.js';
export declare const createDynamodb: (options?: EventHandlerOptions<DynamoDBStreamEvent>) => Decorator<DynamoDBStreamEvent, void>;
export declare const dynamodb: Decorator<DynamoDBStreamEvent, void>;
