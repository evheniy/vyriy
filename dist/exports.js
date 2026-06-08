import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getPackageBinFiles } from './bin.js';
import { hasFile, readFiles } from './file.js';
import { toPackagePath, toPosixPath } from './path.js';
const exportTargetPattern = /^\s*export(?:\s+\*|\s+\{[^}]*\})\s+from\s+['"](\..+\.js)['"];?\s*$/;
export const getMissingExportTarget = async (file, line) => {
    const exportTarget = exportTargetPattern.exec(line)?.[1];
    if (!exportTarget) {
        return undefined;
    }
    const exportTargetPath = path.resolve(path.dirname(file), exportTarget);
    return (await hasFile(exportTargetPath)) ? undefined : exportTargetPath;
};
export const removeMissingJavaScriptExports = async (packageDirectory) => {
    const files = await readFiles(packageDirectory);
    for (const file of files) {
        if (!file.endsWith('.js')) {
            continue;
        }
        const content = await readFile(file, 'utf8');
        const lines = content.split('\n');
        const retainedLines = [];
        for (const line of lines) {
            if (!(await getMissingExportTarget(file, line))) {
                retainedLines.push(line);
            }
        }
        if (retainedLines.length !== lines.length) {
            await writeFile(file, retainedLines.join('\n'));
        }
    }
};
export const getJavaScriptFiles = async (packageDirectory) => {
    const files = await readFiles(packageDirectory);
    const javaScriptFiles = [];
    for (const file of files) {
        const relativeFile = toPosixPath(path.relative(packageDirectory, file));
        const declarationFile = path.join(packageDirectory, relativeFile.replace(/\.js$/, '.d.ts'));
        if (relativeFile.endsWith('.js') && !relativeFile.endsWith('.test.js') && (await hasFile(declarationFile))) {
            javaScriptFiles.push(relativeFile);
        }
    }
    return javaScriptFiles.sort((left, right) => left.localeCompare(right));
};
export const getPackageMain = async (packageDirectory, packageJson, javaScriptFiles) => {
    if (packageJson.main?.endsWith('.js')) {
        const mainPath = packageJson.main.replace(/^\.\//, '');
        if (await hasFile(path.join(packageDirectory, mainPath))) {
            return toPosixPath(mainPath);
        }
    }
    if (javaScriptFiles.includes('index.js')) {
        return 'index.js';
    }
    if (getPackageBinFiles(packageJson).length > 0) {
        return undefined;
    }
    return javaScriptFiles[0];
};
export const createExportTarget = (javaScriptFile) => {
    const packagePath = toPackagePath(javaScriptFile);
    return {
        types: packagePath.replace(/\.js$/, '.d.ts'),
        import: packagePath,
        default: packagePath,
    };
};
export const createExports = (mainFile, javaScriptFiles) => {
    const exports = {
        '.': createExportTarget(mainFile),
    };
    for (const javaScriptFile of javaScriptFiles) {
        const packagePath = toPackagePath(javaScriptFile);
        const extensionlessPackagePath = packagePath.replace(/\.js$/, '');
        const target = createExportTarget(javaScriptFile);
        exports[extensionlessPackagePath] = target;
        exports[packagePath] = target;
    }
    return exports;
};
