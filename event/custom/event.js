import { readOriginFromTarget } from './target.js';
import { validateEventName } from './validation.js';
export const createCustomEvent = (origin, name, detail, options = {}) => new CustomEvent(validateEventName(origin, name), {
    ...options,
    detail,
});
export const dispatchCustomEvent = (target, name, detail, options = {}) => {
    const event = createCustomEvent(readOriginFromTarget(target), name, detail, options);
    target.dispatchEvent(event);
    return event;
};
