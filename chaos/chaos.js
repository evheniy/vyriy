import { toError } from '@vyriy/error';
import { timeout } from '@vyriy/timeout';
export const defaultMessage = 'Chaos error!';
export const defaultProbability = 0.1;
export const defaultTimeoutMs = 1000;
const normalizeProbability = (probability) => {
    if (!Number.isFinite(probability)) {
        return defaultProbability;
    }
    if (probability <= 0) {
        return 0;
    }
    if (probability >= 1) {
        return 1;
    }
    return probability;
};
const selectStrategy = (strategy, random) => {
    if (strategy !== 'random') {
        return strategy;
    }
    return random() < 0.5 ? 'error' : 'timeout';
};
export const chaos = async (options = {}) => {
    const { enabled = false, error = defaultMessage, probability = defaultProbability, random = Math.random, strategy = 'random', timeoutMs = defaultTimeoutMs, } = options;
    if (!enabled || random() >= normalizeProbability(probability)) {
        return;
    }
    if (selectStrategy(strategy, random) === 'timeout') {
        await timeout(timeoutMs);
        return;
    }
    throw toError(error);
};
