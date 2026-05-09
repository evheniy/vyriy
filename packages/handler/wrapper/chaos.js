import { chaos } from '@vyriy/chaos';
import { getChaosEnabled, getChaosErrorEnabled, getChaosTimeoutEnabled, getChaosTimeoutMs } from '@vyriy/env';
import { factory } from '../factory.js';
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
