import { CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs';
export const createClient = (options = {}) => new CloudWatchLogsClient(options);
