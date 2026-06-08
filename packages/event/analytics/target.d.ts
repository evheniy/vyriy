import type { AnalyticsEventTargetLike, AnalyticsInput } from './types.js';
export declare const readOriginFromTarget: (target: AnalyticsEventTargetLike) => string;
export declare const readIdFromTarget: (target: AnalyticsEventTargetLike) => string | null;
export declare const readAnalyticsId: <Data>(target: AnalyticsEventTargetLike, input: AnalyticsInput<Data>) => string | null;
