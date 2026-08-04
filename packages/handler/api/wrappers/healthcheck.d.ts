export type HealthcheckOptions = {
    path?: string;
    action?: () => Promise<void>;
};
export declare const withHealthcheck: (options?: HealthcheckOptions | undefined) => import("../types.js").Decorator<import("packages/router/types.js").APIGatewayProxyEvent, import("packages/router/types.js").APIGatewayProxyResult | {
    statusCode: number;
    body: string;
}>;
