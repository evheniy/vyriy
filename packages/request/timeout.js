import { TimeoutError } from './error.js';
export const withTimeoutSignal = (timeout, signal) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(new TimeoutError(timeout)), timeout);
    const abortFromSource = () => {
        controller.abort(signal?.reason);
    };
    if (signal) {
        if (signal.aborted) {
            abortFromSource();
        }
        else {
            signal.addEventListener('abort', abortFromSource, { once: true });
        }
    }
    return {
        cleanup: () => {
            clearTimeout(timeoutId);
            signal?.removeEventListener('abort', abortFromSource);
        },
        signal: controller.signal,
        timeoutSignal: controller.signal,
    };
};
