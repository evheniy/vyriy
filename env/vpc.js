import { getEnv } from './env.js';
export const getVpc = () => getEnv('VPC');
export const getVpcSecurityGroup = () => getEnv('VPC_SECURITY_GROUP');
export const getVpcSubnets = () => getEnv('VPC_SUBNETS');
