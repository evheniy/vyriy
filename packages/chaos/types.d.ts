export type ChaosStrategy = 'error' | 'timeout' | 'random';
export type ChaosOptions = {
    enabled?: boolean;
    probability?: number;
    strategy?: ChaosStrategy;
    timeoutMs?: number;
    error?: unknown;
    random?: () => number;
};
export type Chaos = (options?: ChaosOptions) => Promise<void>;
