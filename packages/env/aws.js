import { getEnv } from './env.js';
import { AwsRegion } from './types.js';
export const getRegion = () => getEnv('REGION', AwsRegion.EuCentral1);
export const getAccessKeyId = () => getEnv('AWS_ACCESS_KEY_ID');
export const getSecretAccessKey = () => getEnv('AWS_SECRET_ACCESS_KEY');
