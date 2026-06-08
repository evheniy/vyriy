export const existsEnv = (name) => process.env[name] !== undefined;
export const getEnv = (name, defaultValue) => {
    if (existsEnv(name)) {
        return process.env[name];
    }
    if (defaultValue !== undefined) {
        return defaultValue;
    }
    throw new Error(`Environment variable ${name} is not defined!`);
};
export const getNodeEnv = () => getEnv('NODE_ENV', 'development');
export const isNodeEnvProduction = () => getNodeEnv() === 'production';
export const isNodeEnvDevelopment = () => getNodeEnv() === 'development';
export const isNodeEnvTest = () => getNodeEnv() === 'test';
