import { FALSE_VALUES, DEFAULT_AUTO_OPTIONS, TRUE_VALUES } from './constants.js';
import { splitCsv } from './csv.js';
import { tryJsonParse } from './json.js';
import { parseNumber } from './number.js';
export const auto = (value, options = {}) => {
    const resolvedOptions = { ...DEFAULT_AUTO_OPTIONS, ...options };
    const trimmed = value.trim();
    const normalized = trimmed.toLowerCase();
    if (resolvedOptions.nullish && normalized === 'null') {
        return null;
    }
    if (resolvedOptions.nullish && normalized === 'undefined') {
        return undefined;
    }
    if (TRUE_VALUES.has(normalized) && (normalized === 'true' || resolvedOptions.extendedBooleans)) {
        return true;
    }
    if (FALSE_VALUES.has(normalized) && (normalized === 'false' || resolvedOptions.extendedBooleans)) {
        return false;
    }
    const parsedNumber = parseNumber(trimmed);
    if (parsedNumber !== undefined) {
        return parsedNumber;
    }
    if (resolvedOptions.json) {
        const parsed = tryJsonParse(trimmed);
        if (parsed !== undefined) {
            return parsed;
        }
    }
    if (resolvedOptions.csvArrays && trimmed.includes(',')) {
        return splitCsv(trimmed);
    }
    return trimmed;
};
