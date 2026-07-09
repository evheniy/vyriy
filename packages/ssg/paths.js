import { basename, dirname, join } from 'node:path';
export const getStaticSitePaths = (cwd) => {
    const isDistRuntime = basename(cwd) === 'dist';
    const projectRoot = isDistRuntime ? dirname(cwd) : cwd;
    const outputDirectory = isDistRuntime ? cwd : join(cwd, 'dist');
    return {
        consultingOutputPath: join(outputDirectory, 'consulting/index.html'),
        consultingSourcePath: join(projectRoot, 'site/consulting/README.md'),
        docOutputPath: join(outputDirectory, 'docs/index.html'),
        docSourcePath: join(projectRoot, 'site/docs/README.md'),
        outputDirectory,
        outputPath: join(outputDirectory, 'index.html'),
        projectRoot,
        sourcePath: join(projectRoot, 'site/home/README.md'),
    };
};
