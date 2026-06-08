export const splitCsv = (value) => value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
export const csv = (value) => splitCsv(value);
