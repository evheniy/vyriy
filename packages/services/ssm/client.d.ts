import { SSMClient, type SSMClientConfig } from '@aws-sdk/client-ssm';
export declare const createClient: (options?: SSMClientConfig) => SSMClient;
