import { DEFAULT_RETRY_METHODS, DEFAULT_RETRY_STATUSES } from './constants.js';
import { TimeoutError } from './error.js';
import { assertSuccessfulResponse } from './response.js';
import { isRetryableError, isRetryableMethod, wait } from './retry.js';
import { withTimeoutSignal } from './timeout.js';
export const requestStream = async (input, init = {}, options = {}) => {
    const normalizedInit = init ?? {};
    const { onChunk, retries = 2, retryDelay = 300, retryMethods = DEFAULT_RETRY_METHODS, retryStatuses = DEFAULT_RETRY_STATUSES, timeout = 25000, } = options;
    const method = normalizedInit.method?.toUpperCase() ?? 'GET';
    const run = async (attempt = 0) => {
        const { cleanup, signal, timeoutSignal } = withTimeoutSignal(timeout, normalizedInit.signal);
        let chunkConsumptionStarted = false;
        try {
            const response = await fetch(input, { ...normalizedInit, signal });
            assertSuccessfulResponse(response);
            if (!onChunk) {
                cleanup();
                return response;
            }
            const reader = response.body?.getReader();
            if (!reader) {
                cleanup();
                return response;
            }
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break;
                    }
                    chunkConsumptionStarted = true;
                    await onChunk(value, { attempt, response });
                }
            }
            finally {
                reader.releaseLock();
            }
            cleanup();
            return response;
        }
        catch (error) {
            const canRetry = !chunkConsumptionStarted &&
                attempt < retries &&
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
