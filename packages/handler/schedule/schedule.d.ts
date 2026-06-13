import type { ScheduledEvent } from 'aws-lambda';
import type { Decorator, EventHandlerOptions } from '../types.js';
export declare const createSchedule: (options?: EventHandlerOptions<ScheduledEvent>) => Decorator<ScheduledEvent, void>;
export declare const schedule: Decorator<ScheduledEvent<any>, void>;
