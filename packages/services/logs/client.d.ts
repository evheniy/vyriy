import { CloudWatchLogsClient, type CloudWatchLogsClientConfig } from '@aws-sdk/client-cloudwatch-logs';
export declare const createClient: (options?: CloudWatchLogsClientConfig) => CloudWatchLogsClient;
