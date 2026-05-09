import { getEnv } from './env.js';
export const getRegion = () => getEnv('REGION');
export const getAccessKeyId = () => getEnv('AWS_ACCESS_KEY_ID');
export const getSecretAccessKey = () => getEnv('AWS_SECRET_ACCESS_KEY');
