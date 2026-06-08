import packageJson from './package.json' with { type: 'json' };
export const node = () => {
    const majorVersion = Number.parseInt(process.versions.node.split('.')[0]);
    const minimumMajorVersion = Number.parseInt(packageJson.engines.node.match(/(\d+)/)?.[0]);
    if (majorVersion && majorVersion >= minimumMajorVersion) {
        return {
            ok: true,
            version: process.versions.node,
            message: `Node.js ${majorVersion}`,
        };
    }
    return {
        ok: false,
        version: process.versions.node,
        message: `Vyriy requires Node.js >= ${minimumMajorVersion}.\n\nCurrent version: ${process.versions.node}\n\nPlease upgrade Node.js and run the command again.`,
    };
};
