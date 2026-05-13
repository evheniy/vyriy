const getMajorVersion = (version) => {
    const majorVersion = /^v?(\d+)/.exec(version)?.[1];
    return majorVersion ? Number.parseInt(majorVersion, 10) : undefined;
};
export const checkNodeVersion = ({ minimumMajor = 24, version = process.version } = {}) => {
    const majorVersion = getMajorVersion(version);
    const normalizedVersion = version.replace(/^v/, '');
    if (majorVersion && majorVersion >= minimumMajor) {
        return {
            ok: true,
            name: 'Node.js',
            version: normalizedVersion,
            message: `Node.js ${normalizedVersion}`,
        };
    }
    return {
        ok: false,
        name: 'Node.js',
        version: normalizedVersion,
        message: `Vyriy requires Node.js >= ${minimumMajor}.\n\nCurrent version: ${normalizedVersion}\n\nPlease upgrade Node.js and run the command again.`,
    };
};
