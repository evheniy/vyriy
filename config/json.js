export const tryJsonParse = (value) => {
    if (!((value.startsWith('{') && value.endsWith('}')) || (value.startsWith('[') && value.endsWith(']')))) {
        return undefined;
    }
    try {
        return JSON.parse(value);
    }
    catch {
        return undefined;
    }
};
export const json = (value) => {
    const parsed = tryJsonParse(value.trim());
    if (parsed === undefined) {
        throw new TypeError(`Expected JSON (object/array), got: "${value}"`);
    }
    return parsed;
};
