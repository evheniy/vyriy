import { getEnv } from './env.js';
const enabledValues = new Set([
    '1',
    'true',
    'yes',
    'on',
]);
const getBoolean = (name, defaultValue) => enabledValues.has(getEnv(name, `${defaultValue}`).toLowerCase());
const getNumber = (name, defaultValue) => {
    const value = Number(getEnv(name, `${defaultValue}`));
    return Number.isFinite(value) ? value : defaultValue;
};
export const getChaosEnabled = () => getBoolean('CHAOS_ENABLED', false);
export const getChaosErrorEnabled = () => getBoolean('CHAOS_ERROR_ENABLED', true);
export const getChaosTimeoutEnabled = () => getBoolean('CHAOS_TIMEOUT_ENABLED', true);
export const getChaosTimeoutMs = () => getNumber('CHAOS_TIMEOUT_MS', 10000);
