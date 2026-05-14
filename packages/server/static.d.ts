import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { Handler } from '@vyriy/router';
export type StaticFilesOptions = {
    fallback?: false | string;
    fallbackStatusCode?: number;
};
export type StaticFilesHandler = Handler & ((event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>);
export declare const staticFiles: (directory: string, options?: StaticFilesOptions) => StaticFilesHandler;
