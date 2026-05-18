const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const createPackageJson = ({ description, packageScope, projectName, }) => ({
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
            build: 'tsc --pretty false',
            test: 'jest --coverage=false',
            lint: 'eslint .',
        },
        devDependencies: {},
    }),
});
export const createProjectFiles = (plan) => [
    createPackageJson(plan),
    {
        path: 'README.md',
        content: `# ${plan.projectName}\n\n${plan.description}\n`,
    },
    {
        path: 'AGENTS.md',
        content: `# ${plan.projectName} Agent Context\n\nKeep changes scoped, explicit, and easy to validate.\n`,
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
        path: 'src/index.ts',
        content: "export type * from './types.js';\n",
    },
    {
        path: 'src/index.test.ts',
        content: "import { describe, expect, it } from '@jest/globals';\n\ndescribe('project', () => {\n  it('has a test harness', () => {\n    expect(true).toBe(true);\n  });\n});\n",
    },
    {
        path: 'src/types.ts',
        content: 'export type ProjectName = string;\n',
    },
];
