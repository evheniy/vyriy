import path from 'node:path';
export const toPosixPath = (value) => value.split(path.sep).join('/');
export const toPackagePath = (value) => {
    const normalizedValue = toPosixPath(value);
    return `./${normalizedValue.replace(/^\.\//, '')}`;
};
export const toPackageLocalPath = (filePath) => filePath.replace(/^\.\//, '');
