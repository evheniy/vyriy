import { configTargets } from './config-targets.js';
const extensionConfigPaths = new Set([
    'eslint.config.js',
    'jest.config.js',
    'prettier.config.js',
    'stylelint.config.js',
]);
const defaultToolingConfigNames = [
    'typescript',
    'eslint',
    'prettier',
    'jest',
    'storybook',
];
const storybookPathMainContent = `import config from '@vyriy/storybook-config';
import { path } from '@vyriy/path';

export default {
  ...config,
  stories: [
    path('**/*.mdx'),
    path('**/*.stories.@(js|jsx|mjs|ts|tsx)'),
  ],
};
`;
const getStorybookPreviewContent = (specifier, styleImport) => {
    const exportLine = specifier === 'extensionless'
        ? "export { default } from '@vyriy/storybook-config/preview';\n"
        : "export { default } from '@vyriy/storybook-config/preview.js';\n";
    return styleImport ? `import '${styleImport}';\n\n${exportLine}` : exportLine;
};
const withExtension = (path, extension) => {
    if (!extensionConfigPaths.has(path)) {
        return path;
    }
    return path.replace(/\.js$/, `.${extension}`);
};
const withStorybookOverrides = (file, options) => {
    if (file.path === '.storybook/main.ts') {
        return {
            ...file,
            content: options.storybookMainContent ?? (options.storybookStories === 'path' ? storybookPathMainContent : file.content),
        };
    }
    if (file.path === '.storybook/preview.ts') {
        return {
            ...file,
            content: options.storybookPreviewContent ??
                getStorybookPreviewContent(options.storybookPreviewSpecifier ?? 'js', options.storybookPreviewStyleImport),
            path: options.storybookPreviewPath ?? file.path,
        };
    }
    return file;
};
export const createToolingConfigFiles = (options = {}) => {
    const extension = options.extension ?? 'js';
    const names = options.names ?? defaultToolingConfigNames;
    const files = {};
    for (const name of names) {
        for (const targetFile of configTargets[name].files) {
            const file = withStorybookOverrides(targetFile, options);
            files[withExtension(file.path, extension)] = file.content;
        }
    }
    return files;
};
