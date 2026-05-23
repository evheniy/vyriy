import { chmod, copyFile, readdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
const DIST_DIR = 'dist';
const AGENTS_FILE = 'AGENTS.md';
const LICENSE_FILE = 'LICENSE';
const PACKAGE_JSON_FILE = 'package.json';
const PACKAGES_DIR = 'packages';
const README_FILE = 'README.md';
const toPosixPath = (value) => value.split(path.sep).join('/');
const toPackagePath = (value) => {
    const normalizedValue = toPosixPath(value);
    return `./${normalizedValue.replace(/^\.\//, '')}`;
};
const hasFile = async (filePath) => {
    try {
        return (await stat(filePath)).isFile();
    }
    catch {
        return false;
    }
};
const readJson = async (filePath) => {
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content);
};
const writeJson = async (filePath, value) => {
    await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
};
const isEmptyJavaScriptContent = (content) => {
    const normalizedContent = content.trim();
    return normalizedContent.length === 0 || normalizedContent === 'export {};';
};
const exportTargetPattern = /^\s*export(?:\s+\*|\s+\{[^}]*\})\s+from\s+['"](\..+\.js)['"];?\s*$/;
const getMissingExportTarget = async (file, line) => {
    const exportTarget = exportTargetPattern.exec(line)?.[1];
    if (!exportTarget) {
        return undefined;
    }
    const exportTargetPath = path.resolve(path.dirname(file), exportTarget);
    return (await hasFile(exportTargetPath)) ? undefined : exportTargetPath;
};
const readFiles = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            return readFiles(entryPath);
        }
        return entry.isFile() ? [entryPath] : [];
    }));
    return files.flat();
};
const getPackageMain = async (packageDirectory, packageJson, javaScriptFiles) => {
    if (packageJson.main?.endsWith('.js')) {
        const mainPath = packageJson.main.replace(/^\.\//, '');
        if (await hasFile(path.join(packageDirectory, mainPath))) {
            return toPosixPath(mainPath);
        }
    }
    if (javaScriptFiles.includes('index.js')) {
        return 'index.js';
    }
    return javaScriptFiles[0];
};
const createExportTarget = (javaScriptFile) => {
    const packagePath = toPackagePath(javaScriptFile);
    return {
        types: packagePath.replace(/\.js$/, '.d.ts'),
        import: packagePath,
        default: packagePath,
    };
};
const createExports = (mainFile, javaScriptFiles) => {
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
const createPackageRepository = (rootPackageJson, packageDirectory) => {
    const rootRepository = rootPackageJson.repository;
    if (!rootRepository) {
        return undefined;
    }
    return {
        ...rootRepository,
        directory: toPosixPath(path.join(PACKAGES_DIR, path.basename(packageDirectory))),
    };
};
const getJavaScriptFiles = async (packageDirectory) => {
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
const removeEmptyJavaScriptFiles = async (packageDirectory) => {
    const files = await readFiles(packageDirectory);
    for (const file of files) {
        if (file.endsWith('.js') && isEmptyJavaScriptContent(await readFile(file, 'utf8'))) {
            await unlink(file);
        }
    }
};
const removeMissingJavaScriptExports = async (packageDirectory) => {
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
const copyReadme = async (packageDirectory) => {
    const packageName = path.basename(packageDirectory);
    const sourceReadmePath = path.join(PACKAGES_DIR, packageName, README_FILE);
    if (await hasFile(sourceReadmePath)) {
        await copyFile(sourceReadmePath, path.join(packageDirectory, README_FILE));
    }
};
const resolveSourceAgentsPath = async (packageAgentsPath, sharedAgentsPath, rootAgentsPath) => {
    if (await hasFile(packageAgentsPath)) {
        return packageAgentsPath;
    }
    if (await hasFile(sharedAgentsPath)) {
        return sharedAgentsPath;
    }
    return rootAgentsPath;
};
const copyAgents = async (packageDirectory, rootPackageJson) => {
    const packageName = path.basename(packageDirectory);
    const packageAgentsPath = path.join(PACKAGES_DIR, packageName, AGENTS_FILE);
    const sharedAgentsPath = path.join(PACKAGES_DIR, AGENTS_FILE);
    const rootAgentsPath = typeof rootPackageJson.agents === 'string' ? rootPackageJson.agents.replace(/^\.\//, '') : '';
    const sourceAgentsPath = await resolveSourceAgentsPath(packageAgentsPath, sharedAgentsPath, rootAgentsPath);
    if (await hasFile(sourceAgentsPath)) {
        await copyFile(sourceAgentsPath, path.join(packageDirectory, AGENTS_FILE));
        return true;
    }
    return false;
};
const copyLicense = async (packageDirectory) => {
    if (await hasFile(LICENSE_FILE)) {
        await copyFile(LICENSE_FILE, path.join(packageDirectory, LICENSE_FILE));
    }
};
const getPackageBinFiles = (packageJson) => {
    if (typeof packageJson.bin === 'string') {
        return [packageJson.bin];
    }
    if (packageJson.bin && typeof packageJson.bin === 'object') {
        return Object.values(packageJson.bin);
    }
    return [];
};
const makePackageBinsExecutable = async (packageDirectory, packageJson) => {
    for (const binFile of getPackageBinFiles(packageJson)) {
        const binFilePath = path.join(packageDirectory, binFile.replace(/^\.\//, ''));
        if (await hasFile(binFilePath)) {
            await chmod(binFilePath, 0o755);
        }
    }
};
const copyRootFile = async (fileName) => {
    if (await hasFile(fileName)) {
        await copyFile(fileName, path.join(DIST_DIR, fileName));
    }
};
const distRootPackageJson = async () => {
    const packageJson = await readJson(PACKAGE_JSON_FILE);
    delete packageJson.agents;
    delete packageJson.dependencies;
    delete packageJson.packageManager;
    delete packageJson.scripts;
    delete packageJson.devDependencies;
    await writeJson(path.join(DIST_DIR, PACKAGE_JSON_FILE), packageJson);
};
const distRoot = async () => {
    await copyRootFile(README_FILE);
    await copyRootFile(LICENSE_FILE);
    await distRootPackageJson();
};
const syncPackageRuntimeMetadata = (packageJson, rootPackageJson) => {
    if (packageJson.name !== 'vyriy') {
        return;
    }
    packageJson.packageManager = rootPackageJson.packageManager;
    packageJson.engines = rootPackageJson.engines;
};
const distPackage = async (packageJsonPath, rootPackageJson) => {
    const packageDirectory = path.dirname(packageJsonPath);
    const packageJson = await readJson(packageJsonPath);
    await removeEmptyJavaScriptFiles(packageDirectory);
    await removeMissingJavaScriptExports(packageDirectory);
    await removeEmptyJavaScriptFiles(packageDirectory);
    const javaScriptFiles = await getJavaScriptFiles(packageDirectory);
    await copyLicense(packageDirectory);
    await copyReadme(packageDirectory);
    const hasAgents = await copyAgents(packageDirectory, rootPackageJson);
    delete packageJson.private;
    if (hasAgents && rootPackageJson.agents) {
        packageJson.agents = toPackagePath(AGENTS_FILE);
    }
    else {
        delete packageJson.agents;
    }
    if (rootPackageJson.license) {
        packageJson.license = rootPackageJson.license;
    }
    else {
        delete packageJson.license;
    }
    const repository = createPackageRepository(rootPackageJson, packageDirectory);
    if (repository) {
        packageJson.repository = repository;
    }
    else {
        delete packageJson.repository;
    }
    syncPackageRuntimeMetadata(packageJson, rootPackageJson);
    if (javaScriptFiles.length > 0) {
        const mainFile = await getPackageMain(packageDirectory, packageJson, javaScriptFiles);
        if (mainFile) {
            packageJson.main = toPackagePath(mainFile);
            packageJson.types = toPackagePath(mainFile).replace(/\.js$/, '.d.ts');
            packageJson.exports = createExports(mainFile, javaScriptFiles);
        }
    }
    await makePackageBinsExecutable(packageDirectory, packageJson);
    await writeJson(packageJsonPath, packageJson);
};
export const dist = async () => {
    const previousCwd = process.cwd();
    try {
        process.chdir(process.cwd());
        const rootPackageJson = await readJson(PACKAGE_JSON_FILE);
        await distRoot();
        const entries = await readdir(DIST_DIR, { withFileTypes: true });
        const packageJsonPaths = entries
            .filter((entry) => entry.isDirectory())
            .map((entry) => path.join(DIST_DIR, entry.name, 'package.json'))
            .sort((left, right) => left.localeCompare(right));
        for (const packageJsonPath of packageJsonPaths) {
            if (await hasFile(packageJsonPath)) {
                await distPackage(packageJsonPath, rootPackageJson);
            }
        }
        return 0;
    }
    finally {
        process.chdir(previousCwd);
    }
};
