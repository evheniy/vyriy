import { getEnv } from './env.js';
export const getLocalstackHost = () => getEnv('LOCALSTACK_HOST', 'localhost');
export const getLocalstackPort = () => getEnv('LOCALSTACK_PORT', '4566');
