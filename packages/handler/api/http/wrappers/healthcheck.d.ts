import type { HealthcheckOptions as BaseHealthcheckOptions } from '../../wrappers/healthcheck.js';
export type HealthcheckOptions = BaseHealthcheckOptions & {
    body?: unknown;
};
export declare const withHealthcheck: (options?: HealthcheckOptions | undefined) => import("../types.js").Decorator;
