import { packageVersion, peerDependencies, publishedPackageJson } from '../config.js';
import { createPackageManifest } from '../packages/createPackageManifest.js';
export const createLibraryUiFiles = (plan, packagePlan) => [
    createPackageManifest({
        dependencies: {
            '@vyriy/cn': packageVersion(publishedPackageJson.version),
        },
        packageScope: plan.packageScope,
        peerDependencies: {
            react: peerDependencies.react,
        },
        workspaceName: packagePlan.name,
    }),
    {
        path: `packages/${packagePlan.name}/README.md`,
        content: `# ${plan.packageScope}/${packagePlan.name}\n\n${plan.description}\n`,
    },
    {
        path: `packages/${packagePlan.name}/index.ts`,
        content: "export * from './button.js';\n",
    },
    {
        path: `packages/${packagePlan.name}/button.tsx`,
        content: `import type { ComponentProps, FC } from 'react';
import { cn } from '@vyriy/cn';

import './button.scss';

export type ButtonProps = ComponentProps<'button'> & {
  readonly variant?: 'primary' | 'secondary';
};

export type ButtonType = FC<ButtonProps>;

export const Button: ButtonType = ({ className, type = 'button', variant = 'primary', ...props }) => (
  <button className={cn('button', \`button--\${variant}\`, className)} type={type} {...props} />
);
`,
    },
    {
        path: `packages/${packagePlan.name}/button.scss`,
        content: `.button {
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
    },
    {
        path: `packages/${packagePlan.name}/styles.d.ts`,
        content: "declare module '*.scss';\n",
    },
    {
        path: `packages/${packagePlan.name}/button.stories.tsx`,
        content: `import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Button } from './button.js';

const meta = {
  title: 'UI/Button',
  component: Button,
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};
`,
    },
    {
        path: `packages/${packagePlan.name}/button.test.tsx`,
        content: `import type { ReactElement } from 'react';
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
    },
];
