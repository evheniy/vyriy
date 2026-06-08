export declare const withTimeoutSignal: (timeout: number, signal?: AbortSignal | null) => {
    cleanup: () => void;
    signal: AbortSignal;
    timeoutSignal: AbortSignal;
};
