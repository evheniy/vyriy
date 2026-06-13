import type { S3Event } from 'aws-lambda';
import type { Decorator, EventHandlerOptions } from '../types.js';
export declare const createS3: (options?: EventHandlerOptions<S3Event>) => Decorator<S3Event, void>;
export declare const s3: Decorator<S3Event, void>;
