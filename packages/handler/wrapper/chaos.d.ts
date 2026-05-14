import { type ChaosOptions } from '@vyriy/chaos';
export declare const withChaos: <Event, Result, Args extends import("../types.js").HandlerArgs = [context: import("aws-lambda").Context]>(options?: ChaosOptions | undefined) => import("../types.js").Decorator<Event, Result, Args>;
