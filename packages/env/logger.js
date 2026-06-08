import { getEnv } from './env.js';
export const getLogLevel = () => getEnv('LOG_LEVEL', '');
