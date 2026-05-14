import { SNS } from '@aws-sdk/client-sns';
export const createClient = (options = {}) => new SNS(options);
