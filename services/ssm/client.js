import { SSMClient } from '@aws-sdk/client-ssm';
export const createClient = (options = {}) => new SSMClient(options);
