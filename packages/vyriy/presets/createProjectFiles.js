import { createBaseFiles } from './base/createBaseFiles.js';
import { createPackageFiles } from './packages/createPackageFiles.js';
import { createWorkspaceFiles } from './workspaces/createWorkspaceFiles.js';
export const createProjectFiles = (plan) => [
    ...createBaseFiles(plan),
    ...plan.packages.flatMap((packagePlan) => createPackageFiles(plan, packagePlan)),
    ...plan.workspaces.flatMap((workspacePlan) => createWorkspaceFiles(plan, workspacePlan)),
];
