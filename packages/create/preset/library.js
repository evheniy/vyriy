import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import packageJson from '../package.json' with { type: 'json' };
import { styleToolingFiles } from './tooling.js';
const presetDir = dirname(fileURLToPath(import.meta.url));
const agentsPath = [
    resolve(presetDir, '../../../AGENTS.md'),
    resolve(presetDir, '../../../../AGENTS.md'),
].find(existsSync) ?? '';
const agentsContent = agentsPath ? readFileSync(agentsPath, 'utf8') : '';
export const library = (options) => ({
    'README.md': `# Library

Reusable React component library for library applications.

This repository is a Yarn workspace with shared package tooling, Storybook documentation, and Jest tests.

## Packages

### \`@library/components\`

React components exported from \`packages/components\`.

\`\`\`tsx
import { Button } from '@library/components';
\`\`\`

The package currently includes:

| Component | Description                                             |
| --------- | ------------------------------------------------------- |
| \`Button\`  | Styled HTML button with primary and secondary variants. |

## Development

Install dependencies:

\`\`\`bash
yarn install
\`\`\`

Run Storybook:

\`\`\`bash
yarn storybook
\`\`\`

Run the full validation suite:

\`\`\`bash
yarn check
\`\`\`

Focused commands are also available:

\`\`\`bash
yarn lint
yarn build
yarn test
\`\`\`

## Documentation

Storybook renders the package documentation from the repository README files:

- \`README.md\` for the library overview.
- \`packages/components/README.md\` for the components package.
- \`packages/components/button/README.md\` for Button usage and props.

## Project Guidance

These articles describe the development approach behind this preset and provide practical guidance for evolving a project on top of it:

- [Calm Development Environment: Node.js, Corepack, Yarn and Static Preview](https://vyriy.dev/blog/calm-development-setup/) - how to keep the local development environment predictable and easy to reproduce.
- [Calm App Structure for the Vyriy Ecosystem](https://vyriy.dev/blog/vyriy-calm-app-structure/) - a practical project structure for Vyriy applications: shared configs, small packages, thin workspaces, Storybook docs, tests, and deployable entry points.
- [Calm Component Structure](https://vyriy.dev/blog/calm-component-structure/) - how to organize component code, tests, stories, and public exports.
- [Storybook as Project Documentation](https://vyriy.dev/blog/storybook-as-project-documentation/) - how to use Storybook as living project documentation and a component playground.
`,
    'doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="Library" />

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

.claude
.codex
.agents

!/**/.gitkeep
`,
    '.npmrc': 'engine-strict=true\n',
    '.nvmrc': 'lts/krypton\n',
    '.yarnrc.yml': 'nodeLinker: node-modules\nnpmMinimalAgeGate: 5\n',
    '.husky/commit-msg': '#!/bin/sh\n',
    '.husky/post-checkout': '#!/bin/sh\n\nyarn\n',
    '.husky/post-merge': '#!/bin/sh\n\nyarn\n',
    '.husky/pre-commit': '#!/bin/sh\n\nyarn check\n',
    '.husky/pre-push': '#!/bin/sh\n\nyarn check\n',
    'yarn.lock': '',
    ...styleToolingFiles,
    '.prettierignore': 'node_modules\ndist\ncoverage\nstorybook-static\nconsumer\n',
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
            'build:dist': 'rimraf dist && tsc -p tsconfig.build.json && vd',
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
            '@vyriy/dist': `^${packageJson.version}`,
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
    'packages/components/button/button.scss': `.button {
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
    'packages/components/button/button.stories.tsx': `import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Button } from './button.js';

const meta = {
  title: 'Components/Button',
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
    'packages/components/button/button.test.tsx': `import type { ReactElement } from 'react';
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
    'packages/components/button/button.tsx': `import { cn } from '@vyriy/cn';

import type { ButtonType } from './types.js';

import './button.scss';

export const Button: ButtonType = ({ className, variant = 'primary', ...props }) => (
  <button type="button" className={cn('button', \`button--\${variant}\`, className)} {...props} />
);
`,
    'packages/components/button/doc.mdx': `import { Canvas, Controls, Meta, Markdown, Stories } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';
import * as ButtonStories from './button.stories';

<Meta of={ButtonStories} />

<Markdown>{ReadMe}</Markdown>

<Canvas of={ButtonStories.Primary} />

<Controls of={ButtonStories.Primary} />

<Stories />
`,
    'packages/components/button/index.test.ts': `import { describe, expect, it } from '@jest/globals';

import { Button } from './button.js';
import { Button as PublicButton } from './index.js';

describe('ui entry point', () => {
  it('exports Button', () => {
    expect(PublicButton).toBe(Button);
  });
});
`,
    'packages/components/button/index.ts': `export * from './button.js';
export type * from './types.js';
`,
    'packages/components/button/README.md': `# Button

\`Button\` is a lightweight React button component with library styling and native button props.

## Import

\`\`\`tsx
import { Button } from '@library/components';
import type { ButtonProps } from '@library/components';
\`\`\`

## Usage

\`\`\`tsx
<Button>Save</Button>
\`\`\`

The primary variant is used by default. Use the secondary variant for lower-emphasis actions.

\`\`\`tsx
<Button variant="secondary">Cancel</Button>
\`\`\`

Native button props are supported and forwarded to the rendered \`<button>\`.

\`\`\`tsx
<Button type="submit" disabled>
  Submit
</Button>
\`\`\`

Custom classes are composed with the component classes.

\`\`\`tsx
<Button className="settings-action">Open settings</Button>
\`\`\`

## Props

\`ButtonProps\` extends \`ComponentProps<'button'>\`.

| Prop        | Type        | Default      | Description                                        |
| ----------- | ----------- | ------------ | -------------------------------------------------- | -------------------------- |
| \`variant\`   | \`'primary'  | 'secondary'\` | \`'primary'\`                                        | Controls the visual style. |
| \`className\` | \`string\`    | -            | Adds custom classes alongside the library classes. |
| \`children\`  | \`ReactNode\` | -            | Button content.                                    |
`,
    'packages/components/button/types.ts': `import type { ComponentProps, FC } from 'react';

export type ButtonProps = ComponentProps<'button'> & {
  readonly variant?: 'primary' | 'secondary';
};

export type ButtonType = FC<ButtonProps>;
`,
    'packages/components/doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="Components" />

<Markdown>{ReadMe}</Markdown>
`,
    'packages/components/index.test.ts': `import { describe, expect, it } from '@jest/globals';

import { Button } from './button/index.js';
import { Button as PublicButton } from './index.js';

describe('components entry point', () => {
  it('exports Button', () => {
    expect(PublicButton).toBe(Button);
  });
});
`,
    'packages/components/index.ts': `export * from './button/index.js';
`,
    'packages/components/package.json': `{
  "name": "@${options.name}/components",
  "version": "0.0.0",
  "description": "Calm cloud-ready application",
  "private": true,
  "type": "module",
  "dependencies": {
    "@vyriy/cn": "^${packageJson.version}"
  }
}
`,
    'packages/components/README.md': `# Components

Reusable React components for library applications.

## Exports

\`\`\`tsx
import { Button } from '@library/components';
import type { ButtonProps } from '@library/components';
\`\`\`

## Components

### Button

\`Button\` renders an SSR-friendly HTML \`button\` with library styles and two visual variants.

\`\`\`tsx
import { Button } from '@library/components';

export const SaveAction = () => <Button onClick={() => undefined}>Save</Button>;
\`\`\`

Use \`variant="secondary"\` for lower-emphasis actions:

\`\`\`tsx
<Button variant="secondary">Cancel</Button>
\`\`\`

See the Button documentation for the full component API.
`,
    'packages/components/styles.d.ts': `declare module '*.scss';
`,
});
