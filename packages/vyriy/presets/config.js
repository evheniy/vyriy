import packageJson from '../package.json' with { type: 'json' };
export const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
export const packageVersion = (version) => `^${version}`;
const assumePublishedPackageJson = () => { };
assumePublishedPackageJson(packageJson);
export const publishedPackageJson = packageJson;
export const peerDependencies = publishedPackageJson.peerDependencies;
