import type { ScheduledEvent } from 'aws-lambda';
export declare const schedule: import("./types.js").Decorator<ScheduledEvent<any>, void, [context: import("aws-lambda").Context]>;
