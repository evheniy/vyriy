import { agentsTemplate } from '../agentsTemplate.js';
import { json, packageVersion, peerDependencies, publishedPackageJson } from '../config.js';
const baseRootDevDependencies = {
    '@vyriy/typescript-config': packageVersion(publishedPackageJson.version),
    typescript: peerDependencies.typescript,
    '@vyriy/prettier-config': packageVersion(publishedPackageJson.version),
    prettier: peerDependencies.prettier,
    '@vyriy/eslint-config': packageVersion(publishedPackageJson.version),
    eslint: peerDependencies.eslint,
    '@vyriy/jest-config': packageVersion(publishedPackageJson.version),
    jest: peerDependencies.jest,
    '@vyriy/storybook-config': packageVersion(publishedPackageJson.version),
    storybook: peerDependencies.storybook,
    '@storybook/react-webpack5': peerDependencies['@storybook/react-webpack5'],
    react: peerDependencies.react,
    'react-dom': peerDependencies['react-dom'],
    '@types/react': peerDependencies['@types/react'],
    '@types/react-dom': peerDependencies['@types/react-dom'],
    '@vyriy/path': packageVersion(publishedPackageJson.version),
    husky: peerDependencies.husky,
    'npm-run-all2': peerDependencies['npm-run-all2'],
    'cross-env': peerDependencies['cross-env'],
};
const buildDistDevDependencies = {
    vyriy: packageVersion(publishedPackageJson.version),
    rimraf: peerDependencies.rimraf,
};
const stylelintDevDependencies = {
    '@vyriy/stylelint-config': packageVersion(publishedPackageJson.version),
    stylelint: peerDependencies.stylelint,
};
const shouldCreateStylelintConfig = (plan) => plan.features.some((feature) => [
    'react',
    'webpack',
].includes(feature));
const getStylePackageName = (plan) => plan.packages.find((packagePlan) => packagePlan.kind === 'ui')?.name ?? 'ui';
const shouldCreateResetStyles = (plan) => shouldCreateStylelintConfig(plan) && plan.preset !== 'library';
const hasPublishablePackages = (plan) => plan.packages.some((packagePlan) => packagePlan.publishable);
const createRootPackageJson = (plan) => {
    const publishable = hasPublishablePackages(plan);
    const stylelint = shouldCreateStylelintConfig(plan);
    return {
        path: 'package.json',
        content: json({
            name: `${plan.packageScope}/${plan.projectName}`,
            version: '0.0.0',
            description: plan.description,
            private: true,
            type: 'module',
            packageManager: publishedPackageJson.packageManager,
            engines: {
                node: publishedPackageJson.engines.node,
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
                'build:dist': publishable
                    ? 'rimraf dist && tsc -p tsconfig.build.json && vyriy publish'
                    : 'echo "Build dist is not configured yet."',
                'build:storybook': 'cross-env STORYBOOK_DISABLE_TELEMETRY=1 storybook build --quiet --disable-telemetry',
                'test:jest': 'jest --passWithNoTests',
                postinstall: 'husky',
            },
            devDependencies: {
                ...baseRootDevDependencies,
                ...(publishable ? buildDistDevDependencies : {}),
                ...(stylelint ? stylelintDevDependencies : {}),
            },
        }),
    };
};
const createBuildTsConfig = () => ({
    path: 'tsconfig.build.json',
    content: json({
        extends: './tsconfig.json',
        include: [
            'packages/**/*.ts',
            'packages/**/*.tsx',
            'packages/**/*.json',
        ],
        exclude: [
            '**/*.test.ts',
            '**/*.test.tsx',
            '**/*.stories.ts',
            '**/*.stories.tsx',
        ],
        compilerOptions: {
            rootDir: './packages',
            outDir: './dist',
            noEmit: false,
            declaration: true,
            allowImportingTsExtensions: false,
        },
    }),
});
const createStyleFiles = (plan) => shouldCreateStylelintConfig(plan)
    ? [
        {
            path: 'stylelint.config.ts',
            content: "export { default } from '@vyriy/stylelint-config';\n",
        },
        ...(shouldCreateResetStyles(plan)
            ? [
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
    ]
    : [];
export const createBaseFiles = (plan) => [
    createRootPackageJson(plan),
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
        content: 'nodeLinker: node-modules\nnpmMinimalAgeGate: 0\n',
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
    ...(hasPublishablePackages(plan) ? [createBuildTsConfig()] : []),
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
    ...createStyleFiles(plan),
];
