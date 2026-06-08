import { normalizeOrigin } from './validation.js';
export const readOriginFromTarget = (target) => {
    const tagName = target.tagName ?? '';
    return normalizeOrigin(tagName);
};
