export const assertNonEmpty = (value, label) => {
    const normalized = value.trim();
    if (!normalized) {
        throw new Error(`${label} must not be empty.`);
    }
    return normalized;
};
export const normalizeOrigin = (origin) => {
    const normalized = assertNonEmpty(origin, 'Event origin').toLowerCase();
    if (!/^[a-z](?:[a-z0-9-]*[a-z])?$/.test(normalized)) {
        throw new Error(`Invalid event origin "${origin}". Origins must contain only lowercase latin letters, numbers, and dashes, and must start and end with a lowercase latin letter.`);
    }
    return normalized;
};
