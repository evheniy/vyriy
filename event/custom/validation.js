import { OPENMFE_NAME_PATTERN, TAG_NAME_PATTERN } from './constants.js';
export const assertNonEmpty = (value, label) => {
    const normalized = value.trim();
    if (!normalized) {
        throw new Error(`${label} must not be empty.`);
    }
    return normalized;
};
export const normalizeOrigin = (origin) => {
    const normalized = assertNonEmpty(origin, 'Event origin').toLowerCase();
    if (!TAG_NAME_PATTERN.test(normalized)) {
        throw new Error(`Invalid event origin "${origin}". Origins must contain only lowercase latin letters, numbers, and dashes, and must start and end with a lowercase latin letter.`);
    }
    return normalized;
};
export const validateEventName = (origin, name) => {
    const normalizedOrigin = normalizeOrigin(origin);
    const normalizedName = assertNonEmpty(name, 'Event name').toLowerCase();
    if (!OPENMFE_NAME_PATTERN.test(normalizedName)) {
        throw new Error(`Invalid event name "${name}". Event names must use reverse domain notation with lowercase latin letters, numbers, dashes, and dots.`);
    }
    const [rootName] = normalizedName.split('.');
    if (rootName !== normalizedOrigin) {
        throw new Error(`Invalid event name "${name}". Event names must start with the microfrontend tag name "${normalizedOrigin}".`);
    }
    return normalizedName;
};
