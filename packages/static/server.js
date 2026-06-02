import { existsSync } from 'node:fs';
import { server } from '@vyriy/server';
import { useStatic } from './use-static.js';
const DIRECTORIES = [
    'dist',
    'build',
    'public',
    'out',
];
const resolveDirectory = (directory) => directory ?? DIRECTORIES.find((candidate) => existsSync(candidate)) ?? '.';
const createStaticHandler = useStatic;
export const staticServer = async (options = {}) => {
    await Promise.resolve(server(createStaticHandler({ ...options, directory: resolveDirectory(options.directory) })));
    return 0;
};
