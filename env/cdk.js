import { getEnv } from './env.js';
export const getCdkAccount = () => getEnv('CDK_DEFAULT_ACCOUNT');
export const getCdkRegion = () => getEnv('CDK_DEFAULT_REGION');
export const getStack = () => getEnv('STACK', '');
