import type { HealthcheckOptions } from '../../wrappers/healthcheck.js';
export declare const withHealthcheck: (options?: HealthcheckOptions | undefined) => import("../types.js").Decorator<import("aws-lambda").APIGatewayProxyEvent>;
