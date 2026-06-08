import { createRequire } from 'node:module';
const requireFromPackage = createRequire(import.meta.url);
export const resolveDependency = (request) => requireFromPackage.resolve(request);
