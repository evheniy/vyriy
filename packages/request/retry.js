import { HttpError, TimeoutError } from './error.js';
export const isAbortError = (error) => error instanceof DOMException ? error.name === 'AbortError' : false;
export const isRetryableMethod = (method, retryMethods) => retryMethods.includes(method.toUpperCase());
export const isRetryableError = (error, signal, retryStatuses) => {
    if (signal?.aborted) {
        return false;
    }
    if (error instanceof TimeoutError) {
        return true;
    }
    if (error instanceof HttpError) {
        return retryStatuses.includes(error.status);
    }
    return !isAbortError(error);
};
export const wait = async (delay) => {
    if (delay <= 0) {
        return;
    }
    await new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};
