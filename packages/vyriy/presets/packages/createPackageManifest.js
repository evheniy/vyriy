import { json } from '../config.js';
export const createPackageManifest = ({ dependencies = {}, packageScope, peerDependencies = {}, workspaceName, }) => ({
    path: `packages/${workspaceName}/package.json`,
    content: json({
        name: `${packageScope}/${workspaceName}`,
        version: '0.0.0',
        private: true,
        type: 'module',
        main: 'index.js',
        ...(Object.keys(dependencies).length > 0 ? { dependencies } : {}),
        ...(Object.keys(peerDependencies).length > 0 ? { peerDependencies } : {}),
    }),
});
