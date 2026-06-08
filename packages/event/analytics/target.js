import { normalizeOrigin } from './validation.js';
export const readOriginFromTarget = (target) => {
    const tagName = target.tagName ?? '';
    return normalizeOrigin(tagName);
};
export const readIdFromTarget = (target) => {
    if (typeof target.id !== 'string') {
        return null;
    }
    const normalized = target.id.trim();
    return normalized || null;
};
export const readAnalyticsId = (target, input) => {
    if ('id' in input) {
        return input.id ?? null;
    }
    return readIdFromTarget(target);
};
