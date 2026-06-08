import { getEnv } from './env.js';
export const getCiPipelineId = () => getEnv('CI_PIPELINE_IID');
export const getCiMergeRequestId = () => getEnv('CI_MERGE_REQUEST_IID');
export const getCiProjectName = () => getEnv('CI_PROJECT_NAME');
