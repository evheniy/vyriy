export type AnalyticsEventTargetLike = Pick<EventTarget, 'dispatchEvent'> & {
    id?: string;
    tagName?: string;
};
export type AnalyticsEventOptions = {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
};
export type AnalyticsDetail<Data = Record<string, unknown>> = {
    name: string;
    origin: string;
    id: string | null;
    variant: string | null;
    action: string;
    category: string | null;
    data: Data;
};
export type AnalyticsInput<Data = Record<string, unknown>> = {
    name: string;
    id?: string | null;
    variant?: string | null;
    action: string;
    category?: string | null;
    data: Data;
};
export type CreateAnalyticsEvent = <Data>(origin: string, input: AnalyticsInput<Data>, options?: AnalyticsEventOptions) => CustomEvent<AnalyticsDetail<Data>>;
export type DispatchAnalyticsEvent = <Data>(target: AnalyticsEventTargetLike, input: AnalyticsInput<Data>, options?: AnalyticsEventOptions) => CustomEvent<AnalyticsDetail<Data>>;
