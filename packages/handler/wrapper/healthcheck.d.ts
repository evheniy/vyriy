export type HealthcheckOptions = {
    path?: string;
    action?: () => Promise<void>;
};
export type HttpHealthcheckOptions = HealthcheckOptions & {
    body?: unknown;
};
export declare const withHealthcheck: (options?: HealthcheckOptions | undefined) => import("../types.js").Decorator<import("aws-lambda").APIGatewayProxyEvent, import("aws-lambda").APIGatewayProxyResult | {
    statusCode: number;
    body: string;
}>;
export declare const streamWithHealthcheck: (options?: HealthcheckOptions | undefined) => import("../types.js").StreamDecorator<import("aws-lambda").APIGatewayProxyEvent>;
export declare const httpWithHealthcheck: (options?: HttpHealthcheckOptions | undefined) => import("../types.js").HttpDecorator;
