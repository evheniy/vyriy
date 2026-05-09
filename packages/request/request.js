import { DEFAULT_RETRY_METHODS, DEFAULT_RETRY_STATUSES } from './constants.js';
import { TimeoutError } from './error.js';
import { assertSuccessfulResponse, parseResponse } from './response.js';
import { isRetryableError, isRetryableMethod, wait } from './retry.js';
import { withTimeoutSignal } from './timeout.js';
export const request = async (input, init = {}, options = {}) => {
    const normalizedInit = init ?? {};
    const { retries = 2, retryDelay = 300, retryMethods = DEFAULT_RETRY_METHODS, retryStatuses = DEFAULT_RETRY_STATUSES, timeout = 25000, } = options;
    const method = normalizedInit.method?.toUpperCase() ?? 'GET';
    const run = async (attempt = 0) => {
        const { cleanup, signal, timeoutSignal } = withTimeoutSignal(timeout, normalizedInit.signal);
        try {
            const response = await fetch(input, { ...normalizedInit, signal });
            assertSuccessfulResponse(response);
            const result = await parseResponse(response);
            cleanup();
            return result;
        }
        catch (error) {
            const canRetry = attempt < retries &&
                isRetryableMethod(method, retryMethods) &&
                isRetryableError(error, normalizedInit.signal, retryStatuses);
            if (!canRetry) {
                cleanup();
                throw timeoutSignal.aborted && timeoutSignal.reason instanceof TimeoutError ? timeoutSignal.reason : error;
            }
            await wait(retryDelay * (attempt + 1));
            cleanup();
            return run(attempt + 1);
        }
    };
    return run();
};
