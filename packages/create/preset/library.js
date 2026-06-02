import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import packageJson from '../package.json' with { type: 'json' };
const presetDir = dirname(fileURLToPath(import.meta.url));
const agentsPath = [
    resolve(presetDir, '../../../AGENTS.md'),
    resolve(presetDir, '../../../../AGENTS.md'),
].find(existsSync) ?? '';
const agentsContent = agentsPath ? readFileSync(agentsPath, 'utf8') : '';
export const library = (options) => {
    const packageScope = options.scope ?? `@${options.name}`;
    const packageName = `${packageScope}/${options.name}`;
    return {
        'README.md': `# ${options.name}\n\n${options.description}\n`,
        'doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="${options.name}" />

<Markdown>{ReadMe}</Markdown>
`,
        'AGENTS.md': agentsContent,
        '.editorconfig': `# https://editorconfig.org
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
indent_size = 2
`,
        '.gitignore': `.yarn/*
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

!/**/.gitkeep
`,
        '.npmrc': 'engine-strict=true\n',
        '.nvmrc': 'lts/krypton\n',
        '.yarnrc.yml': 'nodeLinker: node-modules\nnpmMinimalAgeGate: 0\n',
        '.husky/commit-msg': '#!/bin/sh\n',
        '.husky/post-checkout': '#!/bin/sh\n\nyarn\n',
        '.husky/post-merge': '#!/bin/sh\n\nyarn\n',
        '.husky/pre-commit': '#!/bin/sh\n\nyarn check\n',
        '.husky/pre-push': '#!/bin/sh\n\nyarn check\n',
        '.storybook/main.ts': `import config from '@vyriy/storybook-config';
import { path } from '@vyriy/path';

export default {
  ...config,
  stories: [
    path('**/*.mdx'),
    path('**/*.stories.@(js|jsx|mjs|ts|tsx)'),
  ],
};
`,
        '.storybook/preview.tsx': "export { default } from '@vyriy/storybook-config/preview';\n",
        'yarn.lock': '',
        'tsconfig.json': JSON.stringify({
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
        }, null, 2) + '\n',
        'prettier.config.ts': "export { default } from '@vyriy/prettier-config';\n",
        '.prettierignore': 'node_modules\ndist\ncoverage\nstorybook-static\nconsumer\n',
        'eslint.config.ts': "export { default } from '@vyriy/eslint-config';\n",
        'jest.config.ts': "export { default } from '@vyriy/jest-config';\n",
        'package.json': JSON.stringify({
            name: options.name,
            version: '0.0.0',
            description: options.description,
            private: true,
            type: 'module',
            agents: './AGENTS.md',
            packageManager: packageJson.packageManager,
            engines: {
                node: packageJson.engines.node,
            },
            workspaces: [
                'packages/*',
            ],
            license: 'MIT',
            repository: {
                type: 'git',
                url: `https://github.com/${options.name}/${options.name}`,
            },
            scripts: {
                storybook: 'cross-env STORYBOOK_DISABLE_TELEMETRY=1 storybook dev -p 6006 --disable-telemetry',
                check: 'run-s lint build test',
                fix: "run-s 'fix:*'",
                lint: "run-s 'lint:*'",
                build: "run-s 'build:*'",
                test: "run-s 'test:*'",
                'fix:prettier': 'prettier . --write',
                'fix:eslint': 'eslint . --fix',
                'fix:stylelint': 'stylelint "**/*.{css,scss}" --fix',
                'lint:ts': 'tsc',
                'lint:prettier': 'prettier . --check',
                'lint:eslint': 'eslint .',
                'lint:stylelint': 'stylelint "**/*.{css,scss}"',
                'build:dist': 'rimraf dist && tsc -p tsconfig.build.json && vyriy dist',
                'build:storybook': 'cross-env STORYBOOK_DISABLE_TELEMETRY=1 storybook build --quiet --disable-telemetry',
                'test:jest': 'jest',
                postinstall: 'husky',
            },
            dependencies: {
                '@vyriy/typescript-config': `^${packageJson.version}`,
                typescript: packageJson.peerDependencies.typescript,
                '@vyriy/prettier-config': `^${packageJson.version}`,
                prettier: packageJson.peerDependencies.prettier,
                '@vyriy/eslint-config': `^${packageJson.version}`,
                eslint: packageJson.peerDependencies.eslint,
                '@vyriy/jest-config': `^${packageJson.version}`,
                jest: packageJson.peerDependencies.jest,
                '@vyriy/storybook-config': `^${packageJson.version}`,
                storybook: packageJson.peerDependencies.storybook,
                '@vyriy/path': `^${packageJson.version}`,
                vyriy: `^${packageJson.version}`,
                husky: packageJson.peerDependencies.husky,
                'npm-run-all2': packageJson.peerDependencies['npm-run-all2'],
                'cross-env': packageJson.peerDependencies['cross-env'],
                react: packageJson.peerDependencies.react,
                'react-dom': packageJson.peerDependencies['react-dom'],
                '@types/react': packageJson.peerDependencies['@types/react'],
                '@types/react-dom': packageJson.peerDependencies['@types/react-dom'],
                '@vyriy/stylelint-config': `^${packageJson.version}`,
                stylelint: packageJson.peerDependencies.stylelint,
                rimraf: packageJson.peerDependencies.rimraf,
            },
        }, null, 2) + '\n',
        'tsconfig.build.json': JSON.stringify({
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
        }, null, 2) + '\n',
        'stylelint.config.ts': "export { default } from '@vyriy/stylelint-config';\n",
        [`packages/${options.name}/package.json`]: JSON.stringify({
            name: packageName,
            version: '0.0.0',
            description: options.description,
            private: true,
            type: 'module',
            main: 'index.js',
            dependencies: {
                '@vyriy/cn': `^${packageJson.version}`,
            },
            peerDependencies: {
                react: packageJson.peerDependencies.react,
            },
        }, null, 2) + '\n',
        [`packages/${options.name}/README.md`]: `# ${packageName}\n\n${options.description}\n`,
        [`packages/${options.name}/doc.mdx`]: `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="UI/Button" />

<Markdown>{ReadMe}</Markdown>
`,
        [`packages/${options.name}/index.ts`]: "export * from './button.js';\nexport type * from './types.js';\n",
        [`packages/${options.name}/types.ts`]: `import type { ComponentProps, FC } from 'react';

export type ButtonProps = ComponentProps<'button'> & {
  readonly variant?: 'primary' | 'secondary';
};

export type ButtonType = FC<ButtonProps>;
`,
        [`packages/${options.name}/button.tsx`]: `import { cn } from '@vyriy/cn';

import type { ButtonType } from './types.js';

import './button.scss';

export const Button: ButtonType = ({ className, variant = 'primary', ...props }) => (
  <button type="button" className={cn('button', \`button--\${variant}\`, className)} {...props} />
);
`,
        [`packages/${options.name}/index.test.ts`]: `import { describe, expect, it } from '@jest/globals';

import { Button } from './button.js';
import { Button as PublicButton } from './index.js';

describe('ui entry point', () => {
  it('exports Button', () => {
    expect(PublicButton).toBe(Button);
  });
});
`,
        [`packages/${options.name}/button.scss`]: `.button {
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  font: inherit;
  padding: 0.5rem 0.875rem;
}

.button--primary {
  background: #1f6feb;
  color: #fff;
}

.button--secondary {
  background: #fff;
  border-color: #d0d7de;
  color: #24292f;
}
`,
        [`packages/${options.name}/styles.d.ts`]: "declare module '*.scss';\n",
        [`packages/${options.name}/button.stories.tsx`]: `import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Button } from './button.js';

const meta = {
  title: 'UI/Button',
  component: Button,
  args: {
    children: 'Button',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Button label.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Visual style of the button.',
      table: {
        type: { summary: "'primary' | 'secondary'" },
        defaultValue: { summary: 'primary' },
      },
    },
    className: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};
`,
        [`packages/${options.name}/button.test.tsx`]: `import type { ReactElement } from 'react';
import { describe, expect, it } from '@jest/globals';

import { Button } from './button.js';

type ButtonElement = ReactElement<{
  readonly className: string;
  readonly type: string;
}>;

describe('Button', () => {
  it('creates a primary button by default', () => {
    const element = Button({ children: 'Save' }) as ButtonElement;

    expect(element.props.className).toBe('button button--primary');
    expect(element.props.type).toBe('button');
  });

  it('composes secondary and custom classes', () => {
    const element = Button({
      children: 'Cancel',
      className: 'wide',
      type: 'submit',
      variant: 'secondary',
    }) as ButtonElement;

    expect(element.props.className).toBe('button button--secondary wide');
    expect(element.props.type).toBe('submit');
  });
});
`,
    };
};
