import { chaos } from '@vyriy/chaos';
import { getConfig } from '@vyriy/config';
import { factory, streamFactory } from '../factory.js';
const getChaosEnabled = () => getConfig('CHAOS_ENABLED', false, 'boolean');
const getChaosErrorEnabled = () => getConfig('CHAOS_ERROR_ENABLED', true, 'boolean');
const getChaosTimeoutEnabled = () => getConfig('CHAOS_TIMEOUT_ENABLED', true, 'boolean');
const getChaosTimeoutMs = () => getConfig('CHAOS_TIMEOUT_MS', 10000, 'number');
const getStrategy = (options) => {
    if (options.strategy) {
        return options.strategy;
    }
    const isErrorEnabled = getChaosErrorEnabled();
    const isTimeoutEnabled = getChaosTimeoutEnabled();
    if (isErrorEnabled && isTimeoutEnabled) {
        return 'random';
    }
    if (isErrorEnabled) {
        return 'error';
    }
    if (isTimeoutEnabled) {
        return 'timeout';
    }
    return 'random';
};
export const withChaos = factory(async (handler, args, options = {}) => {
    const enabled = options.enabled ?? getChaosEnabled();
    const strategy = getStrategy(options);
    await chaos({
        ...options,
        enabled: enabled && (strategy !== 'random' || getChaosErrorEnabled() || getChaosTimeoutEnabled()),
        strategy,
        timeoutMs: options.timeoutMs ?? getChaosTimeoutMs(),
    });
    return handler(...args);
});
export const streamWithChaos = streamFactory(async (handler, args, options = {}) => {
    const enabled = options.enabled ?? getChaosEnabled();
    const strategy = getStrategy(options);
    await chaos({
        ...options,
        enabled: enabled && (strategy !== 'random' || getChaosErrorEnabled() || getChaosTimeoutEnabled()),
        strategy,
        timeoutMs: options.timeoutMs ?? getChaosTimeoutMs(),
    });
    return handler(...args);
});
