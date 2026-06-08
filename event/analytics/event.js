import { OPENMFE_ANALYTICS_EVENT_NAME } from './constants.js';
import { readAnalyticsId, readOriginFromTarget } from './target.js';
import { assertNonEmpty, normalizeOrigin } from './validation.js';
export const createAnalyticsEvent = (origin, input, options = {}) => {
    const normalizedOrigin = normalizeOrigin(origin);
    const name = assertNonEmpty(input.name, 'Analytics event detail.name');
    const action = assertNonEmpty(input.action, 'Analytics event detail.action');
    const id = input.id ?? null;
    const category = input.category ?? null;
    const variant = input.variant ?? null;
    return new CustomEvent(OPENMFE_ANALYTICS_EVENT_NAME, {
        ...options,
        detail: {
            action,
            category,
            data: input.data,
            id,
            name,
            origin: normalizedOrigin,
            variant,
        },
    });
};
export const dispatchAnalyticsEvent = (target, input, options = {}) => {
    const event = createAnalyticsEvent(readOriginFromTarget(target), {
        ...input,
        id: readAnalyticsId(target, input),
    }, options);
    target.dispatchEvent(event);
    return event;
};
