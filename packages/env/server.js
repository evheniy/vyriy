import { getEnv } from './env.js';
export const getPort = () => getEnv('PORT', '3000');
