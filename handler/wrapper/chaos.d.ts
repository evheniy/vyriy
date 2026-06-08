import { type ChaosOptions } from '@vyriy/chaos';
export declare const withChaos: <Event, Result>(options?: ChaosOptions | undefined) => import("../types.js").Decorator<Event, Result>;
export declare const streamWithChaos: <Event>(options?: ChaosOptions | undefined) => import("../types.js").StreamDecorator<Event>;
