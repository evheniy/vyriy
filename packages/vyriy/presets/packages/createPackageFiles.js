import { createLibraryUiFiles } from '../library/createLibraryUiFiles.js';
import { createPackageManifest } from './createPackageManifest.js';
const createGenericPackageFiles = (plan, packagePlan) => [
    createPackageManifest({
        packageScope: plan.packageScope,
        workspaceName: packagePlan.name,
    }),
    {
        path: `packages/${packagePlan.name}/README.md`,
        content: `# ${plan.packageScope}/${packagePlan.name}\n\n${plan.description}\n`,
    },
    {
        path: `packages/${packagePlan.name}/index.ts`,
        content: packagePlan.kind === 'stack' ? "export * from './stack.js';\n" : "export type * from './types.js';\n",
    },
    ...(packagePlan.kind === 'stack'
        ? [
            {
                path: `packages/${packagePlan.name}/stack.ts`,
                content: 'export type StackName = string;\n',
            },
            {
                path: `packages/${packagePlan.name}/stack.test.ts`,
                content: "import { describe, expect, it } from '@jest/globals';\n\ndescribe('stack', () => {\n  it('has a test harness', () => {\n    expect(true).toBe(true);\n  });\n});\n",
            },
        ]
        : [
            {
                path: `packages/${packagePlan.name}/types.ts`,
                content: 'export type PackageName = string;\n',
            },
            {
                path: `packages/${packagePlan.name}/${packagePlan.name}.test.ts`,
                content: "import { describe, expect, it } from '@jest/globals';\n\ndescribe('package', () => {\n  it('has a test harness', () => {\n    expect(true).toBe(true);\n  });\n});\n",
            },
        ]),
];
const createPresetPackageFiles = (plan, packagePlan) => plan.preset === 'library' && packagePlan.kind === 'ui' ? createLibraryUiFiles(plan, packagePlan) : undefined;
export const createPackageFiles = (plan, packagePlan) => createPresetPackageFiles(plan, packagePlan) ?? createGenericPackageFiles(plan, packagePlan);
