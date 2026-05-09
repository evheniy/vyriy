import { mkdirSync, readdirSync, realpathSync } from 'node:fs';
import { basename, resolve } from 'node:path';
export const path = (...pathSegments) => resolve(realpathSync(process.env.PROJECT_CWD || process.cwd()), ...pathSegments);
export const directory = (...pathSegments) => basename(path(...pathSegments));
export const readdir = (...pathSegments) => readdirSync(path(...pathSegments));
export const isEmpty = (...pathSegments) => !readdir(...pathSegments).filter((name) => !['README.md', '.git'].includes(name)).length;
export const mkdir = (...pathSegments) => mkdirSync(path(...pathSegments), { recursive: true });
