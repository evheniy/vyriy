import { agentsTemplate } from './agentsTemplate.js';
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const createRootPackageJson = ({ description, packageScope, projectName, }) => ({
    path: 'package.json',
    content: json({
        name: `${packageScope}/${projectName}`,
        version: '0.1.0',
        description,
        private: true,
        type: 'module',
        packageManager: 'yarn@4.14.1',
        engines: {
            node: '>=24.0.0',
        },
        scripts: {
            lint: 'eslint .',
            test: 'jest --coverage=false',
            build: 'tsc --pretty false',
            deploy: 'echo "Deploy is not configured yet."',
            smoke: 'echo "Smoke checks are not configured yet."',
            e2e: 'echo "E2E checks are not configured yet."',
        },
        devDependencies: {},
        workspaces: [
            'packages/*',
            'workspaces/*',
        ],
    }),
});
const createPackageManifest = ({ packageScope, workspaceName, }) => ({
    path: `packages/${workspaceName}/package.json`,
    content: json({
        name: `${packageScope}/${workspaceName}`,
        version: '0.1.0',
        private: true,
        type: 'module',
        main: 'index.js',
    }),
});
const createPackageFiles = (plan, packagePlan) => [
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
const createWorkspaceFiles = (plan, workspacePlan) => [
    {
        path: `workspaces/${workspacePlan.name}/package.json`,
        content: json({
            name: `${plan.packageScope}/${workspacePlan.name}-workspace`,
            version: '0.1.0',
            private: true,
            type: 'module',
            main: 'index.js',
        }),
    },
    {
        path: `workspaces/${workspacePlan.name}/index.ts`,
        content: 'export type WorkspaceName = string;\n',
    },
    {
        path: `workspaces/${workspacePlan.name}/${workspacePlan.name}.test.ts`,
        content: "import { describe, expect, it } from '@jest/globals';\n\ndescribe('workspace', () => {\n  it('has a test harness', () => {\n    expect(true).toBe(true);\n  });\n});\n",
    },
];
const shouldCreateStylelintConfig = (plan) => plan.features.some((feature) => [
    'react',
    'webpack',
].includes(feature));
export const createProjectFiles = (plan) => [
    createRootPackageJson(plan),
    {
        path: 'README.md',
        content: `# ${plan.projectName}\n\n${plan.description}\n`,
    },
    {
        path: 'doc.mdx',
        content: "import { Meta, Markdown } from '@storybook/addon-docs/blocks';\nimport ReadMe from './README.md?raw';\n\n<Meta title=\"Project/README\" />\n\n<Markdown>{ReadMe}</Markdown>\n",
    },
    {
        path: 'AGENTS.md',
        content: agentsTemplate,
    },
    {
        path: '.editorconfig',
        content: 'root = true\n\n[*]\ncharset = utf-8\nend_of_line = lf\ninsert_final_newline = true\nindent_style = space\nindent_size = 2\n',
    },
    {
        path: '.gitignore',
        content: 'node_modules/\ndist/\ncoverage/\n.yarn/cache/\n.env\n',
    },
    {
        path: '.npmrc',
        content: 'engine-strict=true\n',
    },
    {
        path: '.nvmrc',
        content: '24\n',
    },
    {
        path: '.yarnrc.yml',
        content: 'nodeLinker: node-modules\n',
    },
    {
        path: 'yarn.lock',
        content: '',
    },
    {
        path: 'tsconfig.json',
        content: json({
            extends: '@vyriy/typescript-config/index.json',
            compilerOptions: {
                noEmit: false,
            },
            include: [
                'packages/**/*.ts',
                'packages/**/*.tsx',
                'workspaces/**/*.ts',
                'workspaces/**/*.tsx',
                '*.ts',
            ],
        }),
    },
    {
        path: 'prettier.config.ts',
        content: "export { default } from '@vyriy/prettier-config';\n",
    },
    {
        path: '.prettierignore',
        content: 'node_modules\ndist\ncoverage\nstorybook-static\n',
    },
    {
        path: 'eslint.config.ts',
        content: "export { default } from '@vyriy/eslint-config';\n",
    },
    {
        path: 'jest.config.ts',
        content: "export { default } from '@vyriy/jest-config';\n",
    },
    ...(shouldCreateStylelintConfig(plan)
        ? [
            {
                path: 'stylelint.config.ts',
                content: "export { default } from '@vyriy/stylelint-config';\n",
            },
        ]
        : []),
    ...plan.packages.flatMap((packagePlan) => createPackageFiles(plan, packagePlan)),
    ...plan.workspaces.flatMap((workspacePlan) => createWorkspaceFiles(plan, workspacePlan)),
];
