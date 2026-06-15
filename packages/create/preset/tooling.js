import { createToolingConfigFiles } from '@vyriy/tooling';
const createPresetToolingConfigFiles = (names) => createToolingConfigFiles({
    extension: 'ts',
    names,
    storybookPreviewPath: '.storybook/preview.tsx',
    storybookPreviewSpecifier: 'extensionless',
    storybookStories: 'path',
});
export const baseToolingFiles = createPresetToolingConfigFiles();
export const styleToolingFiles = createPresetToolingConfigFiles([
    'typescript',
    'eslint',
    'prettier',
    'jest',
    'storybook',
    'stylelint',
]);
export const reactStyleToolingFiles = createToolingConfigFiles({
    extension: 'ts',
    names: [
        'typescript',
        'eslint',
        'prettier',
        'jest',
        'storybook',
        'stylelint',
    ],
    storybookPreviewPath: '.storybook/preview.tsx',
    storybookPreviewSpecifier: 'extensionless',
    storybookPreviewStyleImport: '../packages/components/styles.scss',
    storybookStories: 'path',
});
