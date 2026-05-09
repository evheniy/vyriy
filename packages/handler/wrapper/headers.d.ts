import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
export declare const withHeaders: (options?: Record<string, string> | undefined) => import("../types.js").Decorator<APIGatewayProxyEvent, APIGatewayProxyResult>;
