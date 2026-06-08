import { getEnv } from './env.js';
export const getEcsClusterName = () => getEnv('ECS_CLUSTER_NAME');
export const getEcsTaskDefinition = () => getEnv('ECS_TASK_DEFINITION');
export const getEcsContainerName = () => getEnv('ECS_CONTAINER_NAME');
export const getTask = () => getEnv('TASK');
