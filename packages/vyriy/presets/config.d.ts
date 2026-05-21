import packageJson from '../package.json';
type PublishedPackageJson = typeof packageJson & {
    readonly engines: {
        readonly node: string;
    };
    readonly packageManager: string;
};
export declare const json: (value: unknown) => string;
export declare const packageVersion: (version: string) => string;
export declare const publishedPackageJson: PublishedPackageJson;
export declare const peerDependencies: {
    "@storybook/react-webpack5": string;
    "@types/react": string;
    "@types/react-dom": string;
    "cross-env": string;
    eslint: string;
    husky: string;
    jest: string;
    "npm-run-all2": string;
    prettier: string;
    react: string;
    "react-dom": string;
    rimraf: string;
    storybook: string;
    stylelint: string;
    typescript: string;
};
export {};
