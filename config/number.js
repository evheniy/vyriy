const isNumericString = (value) => value !== '' && !Number.isNaN(Number(value));
export const parseNumber = (value) => {
    const trimmed = value.trim();
    return isNumericString(trimmed) ? Number(trimmed) : undefined;
};
export const number = (value) => {
    const parsed = parseNumber(value);
    if (parsed === undefined) {
        throw new TypeError(`Expected number, got: "${value}"`);
    }
    return parsed;
};
export const int = (value) => {
    const parsed = number(value);
    if (!Number.isInteger(parsed)) {
        throw new TypeError(`Expected integer, got: ${parsed}`);
    }
    return parsed;
};
