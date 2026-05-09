import { FALSE_VALUES, TRUE_VALUES } from './constants.js';
const parseBoolean = (value, options = {}) => {
    const normalized = value.trim().toLowerCase();
    const { extendedBooleans = true } = options;
    if (normalized === 'true') {
        return true;
    }
    if (normalized === 'false') {
        return false;
    }
    if (extendedBooleans && TRUE_VALUES.has(normalized)) {
        return true;
    }
    if (extendedBooleans && FALSE_VALUES.has(normalized)) {
        return false;
    }
    throw new TypeError(`Expected boolean, got: "${value}"`);
};
export const boolean = (value, options = {}) => parseBoolean(value, options);
