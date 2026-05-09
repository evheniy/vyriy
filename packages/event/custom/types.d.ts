export type CustomEventTargetLike = Pick<EventTarget, 'dispatchEvent'> & {
    tagName?: string;
};
export type CustomEventOptions = {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
};
export type ValidateEventName = (origin: string, name: string) => string;
export type CreateCustomEvent = <Detail>(origin: string, name: string, detail: Detail, options?: CustomEventOptions) => CustomEvent<Detail>;
export type DispatchCustomEvent = <Detail>(target: CustomEventTargetLike, name: string, detail: Detail, options?: CustomEventOptions) => CustomEvent<Detail>;
