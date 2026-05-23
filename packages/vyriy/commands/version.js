import packageJson from '../package.json' with { type: 'json' };
export const version = async () => {
    console.log(packageJson.version);
    await Promise.resolve();
    return 0;
};
