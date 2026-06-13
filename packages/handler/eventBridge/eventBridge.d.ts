import type { EventBridgeEvent } from 'aws-lambda';
import type { Decorator, EventHandlerOptions } from '../types.js';
export declare const createEventBridge: (options?: EventHandlerOptions<EventBridgeEvent<string, unknown>>) => Decorator<EventBridgeEvent<string, unknown>, void>;
export declare const eventBridge: Decorator<EventBridgeEvent<string, unknown>, void>;
