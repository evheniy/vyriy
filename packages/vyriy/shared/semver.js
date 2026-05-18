export const getMajorVersion = (version) => {
    const majorVersion = /^v?(\d+)/.exec(version.trim())?.[1];
    return majorVersion ? Number.parseInt(majorVersion, 10) : undefined;
};
