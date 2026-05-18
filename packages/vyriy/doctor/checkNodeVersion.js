import { getMajorVersion } from '../shared/index.js';
export const checkNodeVersion = ({ minimumMajor = 24, version = process.version, } = {}) => {
    const normalizedVersion = version.replace(/^v/, '');
    const majorVersion = getMajorVersion(normalizedVersion);
    if (majorVersion !== undefined && majorVersion >= minimumMajor) {
        return {
            name: 'node',
            label: 'Node.js',
            group: 'Runtime',
            level: 'ok',
            version: normalizedVersion,
            message: `Node.js ${normalizedVersion}`,
        };
    }
    return {
        name: 'node',
        label: 'Node.js',
        group: 'Runtime',
        level: 'error',
        version: normalizedVersion,
        message: `Node.js ${normalizedVersion} detected`,
        detail: `Vyriy requires Node.js ${minimumMajor} or newer.`,
    };
};
