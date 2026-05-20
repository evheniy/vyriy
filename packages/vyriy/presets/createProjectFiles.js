import { agentsTemplate } from './agentsTemplate.js';
import rootPackageJson from '../../../package.json' with { type: 'json' };
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const packageVersion = (version) => `^${version}`;
const baseRootDevDependencies = {
    '@vyriy/typescript-config': packageVersion(rootPackageJson.version),
    typescript: rootPackageJson.dependencies.typescript,
    '@vyriy/prettier-config': packageVersion(rootPackageJson.version),
    prettier: rootPackageJson.dependencies.prettier,
    '@vyriy/eslint-config': packageVersion(rootPackageJson.version),
    eslint: rootPackageJson.dependencies.eslint,
    '@vyriy/jest-config': packageVersion(rootPackageJson.version),
    jest: rootPackageJson.dependencies.jest,
    '@vyriy/storybook-config': packageVersion(rootPackageJson.version),
    storybook: rootPackageJson.dependencies.storybook,
    '@vyriy/path': packageVersion(rootPackageJson.version),
    husky: rootPackageJson.dependencies.husky,
    'npm-run-all2': rootPackageJson.dependencies['npm-run-all2'],
    'cross-env': rootPackageJson.dependencies['cross-env'],
};
const stylelintDevDependencies = {
    '@vyriy/stylelint-config': packageVersion(rootPackageJson.version),
    stylelint: rootPackageJson.dependencies.stylelint,
};
const createRootPackageJson = ({ description, packageScope, projectName, stylelint, }) => ({
    path: 'package.json',
    content: json({
        name: `${packageScope}/${projectName}`,
        version: '0.0.0',
        description,
        private: true,
        type: 'module',
        packageManager: rootPackageJson.packageManager,
        engines: {
            node: rootPackageJson.engines.node,
        },
        workspaces: [
            'packages/*',
            'workspaces/*',
        ],
        scripts: {
            storybook: 'cross-env STORYBOOK_DISABLE_TELEMETRY=1 storybook dev -p 6006 --disable-telemetry',
            check: 'run-s lint build test',
            fix: "run-s 'fix:*'",
            lint: "run-s 'lint:*'",
            build: "run-s 'build:*'",
            test: "run-s 'test:*'",
            'fix:prettier': 'prettier . --write',
            'fix:eslint': 'eslint . --fix',
            'lint:ts': 'tsc --pretty false',
            'lint:prettier': 'prettier . --check',
            'lint:eslint': 'eslint .',
            ...(stylelint ? { 'lint:stylelint': 'stylelint "packages/**/*.{scss,css}"' } : {}),
            'build:dist': 'echo "Build dist is not configured yet."',
            'build:storybook': 'cross-env STORYBOOK_DISABLE_TELEMETRY=1 storybook build --quiet --disable-telemetry',
            'test:jest': 'jest --passWithNoTests',
            postinstall: 'husky',
        },
        devDependencies: {
            ...baseRootDevDependencies,
            ...(stylelint ? stylelintDevDependencies : {}),
        },
    }),
});
const createPackageManifest = ({ packageScope, workspaceName, }) => ({
    path: `packages/${workspaceName}/package.json`,
    content: json({
        name: `${packageScope}/${workspaceName}`,
        version: '0.0.0',
        private: true,
        type: 'module',
        main: 'index.js',
    }),
});
const getWorkspacePath = (workspacePlan) => workspacePlan.kind === 'lambda' && workspacePlan.name === 'api'
    ? `workspaces/lambda/${workspacePlan.name}`
    : `workspaces/${workspacePlan.name}`;
const getWorkspacePackageName = ({ packageScope, workspacePlan, }) => workspacePlan.kind === 'lambda' && workspacePlan.name === 'api'
    ? `${packageScope}/lambda-api-workspace`
    : `${packageScope}/${workspacePlan.name}-workspace`;
const isApiWorkspace = (workspacePlan) => [
    'api',
    'lambda',
    'fargate',
].includes(workspacePlan.kind);
const createApiWorkspaceDependencies = (workspacePlan) => isApiWorkspace(workspacePlan)
    ? {
        '@vyriy/handler': packageVersion(rootPackageJson.version),
        '@vyriy/server': packageVersion(rootPackageJson.version),
    }
    : {};
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
const createApiHandlerFile = (workspacePath) => ({
    path: `${workspacePath}/handler.ts`,
    content: `import { api } from '@vyriy/handler';

export const handler = api(async (event) => ({
  statusCode: 200,
  body: JSON.stringify({
    path: event.path,
  }),
}));
`,
});
const createApiServerFile = ({ entrypoint, workspacePath, }) => ({
    path: `${workspacePath}/${entrypoint}`,
    content: `import { server } from '@vyriy/server';

import { handler } from './handler.js';

server(handler);
`,
});
const createDockerfile = (workspacePath) => ({
    path: `${workspacePath}/Dockerfile`,
    content: `FROM node:24-alpine

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY packages ./packages
COPY workspaces ./workspaces

RUN corepack enable && yarn install --immutable
RUN yarn build

CMD ["node", "workspaces/api/index.js"]
`,
});
const createApiWorkspaceFiles = (plan, workspacePlan) => {
    const workspacePath = getWorkspacePath(workspacePlan);
    const isLambda = workspacePlan.kind === 'lambda';
    return [
        createApiHandlerFile(workspacePath),
        createApiServerFile({ entrypoint: isLambda ? 'server.ts' : 'index.ts', workspacePath }),
        {
            path: `${workspacePath}/${workspacePlan.name}.test.ts`,
            content: "import { describe, expect, it } from '@jest/globals';\n\nimport { handler } from './handler.js';\n\ndescribe('api workspace', () => {\n  it('exports a handler', () => {\n    expect(handler).toEqual(expect.any(Function));\n  });\n});\n",
        },
        ...(plan.features.includes('docker') && !isLambda ? [createDockerfile(workspacePath)] : []),
    ];
};
const createWorkspaceFiles = (plan, workspacePlan) => {
    const workspacePath = getWorkspacePath(workspacePlan);
    const dependencies = createApiWorkspaceDependencies(workspacePlan);
    return [
        {
            path: `${workspacePath}/package.json`,
            content: json({
                name: getWorkspacePackageName({ packageScope: plan.packageScope, workspacePlan }),
                version: '0.0.0',
                private: true,
                type: 'module',
                main: workspacePlan.kind === 'lambda' ? 'server.js' : 'index.js',
                ...(Object.keys(dependencies).length > 0 ? { dependencies } : {}),
            }),
        },
        ...(isApiWorkspace(workspacePlan)
            ? createApiWorkspaceFiles(plan, workspacePlan)
            : [
                {
                    path: `${workspacePath}/index.ts`,
                    content: 'export type WorkspaceName = string;\n',
                },
                {
                    path: `${workspacePath}/${workspacePlan.name}.test.ts`,
                    content: "import { describe, expect, it } from '@jest/globals';\n\ndescribe('workspace', () => {\n  it('has a test harness', () => {\n    expect(true).toBe(true);\n  });\n});\n",
                },
            ]),
    ];
};
const shouldCreateStylelintConfig = (plan) => plan.features.some((feature) => [
    'react',
    'webpack',
].includes(feature));
const getStylePackageName = (plan) => plan.packages.find((packagePlan) => packagePlan.kind === 'ui')?.name ?? 'ui';
export const createProjectFiles = (plan) => [
    createRootPackageJson({
        ...plan,
        stylelint: shouldCreateStylelintConfig(plan),
    }),
    {
        path: 'README.md',
        content: `# ${plan.projectName}\n\n${plan.description}\n`,
    },
    {
        path: 'doc.mdx',
        content: `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="${plan.projectName}" />

<Markdown>{ReadMe}</Markdown>
`,
    },
    {
        path: 'AGENTS.md',
        content: agentsTemplate,
    },
    {
        path: '.editorconfig',
        content: `# https://editorconfig.org
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

indent_style = space
indent_size = 2

max_line_length = 100

# Markdown
[*.md]
trim_trailing_whitespace = false
max_line_length = off

# YAML / YML
[*.{yml,yaml}]
indent_size = 2

# JSON
[*.json]
indent_size = 2

# TypeScript / JavaScript
[*.{ts,tsx,js,jsx}]
indent_size = 2

# Shell / Bash
[*.sh]
indent_size = 2`,
    },
    {
        path: '.gitignore',
        content: `.yarn/*
!.yarn/cache
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

.DS_Store
.idea
node_modules
coverage
dist
storybook-static
*storybook.log
consumer

cdk.out
cdk.context.json

!/**/.gitkeep`,
    },
    {
        path: '.npmrc',
        content: 'engine-strict=true\n',
    },
    {
        path: '.nvmrc',
        content: 'lts/krypton',
    },
    {
        path: '.yarnrc.yml',
        content: 'nodeLinker: node-modules\n',
    },
    {
        path: '.husky/commit-msg',
        content: '#!/bin/sh\n',
    },
    {
        path: '.husky/post-checkout',
        content: '#!/bin/sh\n\nyarn\n',
    },
    {
        path: '.husky/post-merge',
        content: '#!/bin/sh\n\nyarn\n',
    },
    {
        path: '.husky/pre-commit',
        content: '#!/bin/sh\n\nyarn check\n',
    },
    {
        path: '.husky/pre-push',
        content: '#!/bin/sh\n\nyarn check\n',
    },
    {
        path: '.storybook/main.ts',
        content: `import config from '@vyriy/storybook-config';
import { path } from '@vyriy/path';

export default {
  ...config,
  stories: [
    path('**/*.mdx'),
    path('**/*.stories.@(js|jsx|mjs|ts|tsx)'),
  ],
};
`,
    },
    {
        path: '.storybook/preview.tsx',
        content: "export { default } from '@vyriy/storybook-config/preview';\n",
    },
    {
        path: 'yarn.lock',
        content: '',
    },
    {
        path: 'tsconfig.json',
        content: json({
            extends: '@vyriy/typescript-config/index.json',
            include: [
                '.storybook/**/*.ts',
                '.storybook/**/*.tsx',
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
            {
                path: `packages/${getStylePackageName(plan)}/reset.scss`,
                content: `html {
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

body {
  margin: 0;
}
`,
            },
        ]
        : []),
    ...plan.packages.flatMap((packagePlan) => createPackageFiles(plan, packagePlan)),
    ...plan.workspaces.flatMap((workspacePlan) => createWorkspaceFiles(plan, workspacePlan)),
];
