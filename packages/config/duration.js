const DURATION_UNITS = {
    ms: 1,
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
};
export const parseDuration = (value) => {
    const match = /^(\d+)(ms|s|m|h|d)$/.exec(value.trim().toLowerCase());
    if (!match) {
        throw new Error(`Invalid duration: "${value}"`);
    }
    const [, amount, unit] = match;
    return Number(amount) * DURATION_UNITS[unit];
};
