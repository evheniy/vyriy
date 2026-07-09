export type StaticSitePaths = {
    readonly consultingOutputPath: string;
    readonly consultingSourcePath: string;
    readonly docOutputPath: string;
    readonly docSourcePath: string;
    readonly outputDirectory: string;
    readonly outputPath: string;
    readonly projectRoot: string;
    readonly sourcePath: string;
};
export declare const getStaticSitePaths: (cwd: string) => StaticSitePaths;
