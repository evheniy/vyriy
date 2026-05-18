import { ProjectFile } from '../file-plan/index.js';
import { VyriyProjectPlan } from '../project-plan/index.js';
export type CreateProjectFiles = (plan: VyriyProjectPlan) => ProjectFile[];
