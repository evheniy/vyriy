import { LambdaClient, type LambdaClientConfig } from '@aws-sdk/client-lambda';
export declare const createClient: (options?: LambdaClientConfig) => LambdaClient;
