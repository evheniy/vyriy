import type { SESEvent } from 'aws-lambda';
import type { Decorator, EventHandlerOptions } from '../types.js';
export declare const createSes: (options?: EventHandlerOptions<SESEvent>) => Decorator<SESEvent, void>;
export declare const ses: Decorator<SESEvent, void>;
