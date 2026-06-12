export declare const withHeaders: (options?: Record<string, string> | undefined) => import("../types.js").Decorator<import("aws-lambda").APIGatewayProxyEvent, import("aws-lambda").APIGatewayProxyResult>;
export declare const streamWithHeaders: (options?: Record<string, string> | undefined) => import("../types.js").StreamDecorator<import("aws-lambda").APIGatewayProxyEvent>;
export declare const httpWithHeaders: (options?: Record<string, string> | undefined) => import("../types.js").HttpDecorator;
