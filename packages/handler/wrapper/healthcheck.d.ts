import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
export declare const withHealthcheck: (options?: {
    path?: string;
    action?: () => Promise<void>;
} | undefined) => import("../types.js").Decorator<APIGatewayProxyEvent, APIGatewayProxyResult>;
