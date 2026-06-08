import { isAbsolute } from 'node:path';
const isPackageRequest = (request) => !request.startsWith('.') && !isAbsolute(request);
const matchesPattern = (pattern, request) => typeof pattern === 'string' ? pattern === request : pattern.test(request);
export const external = (options = {}) => {
    const allowlist = options.allowlist ?? [];
    return ({ request }, callback) => {
        const shouldBundle = !request || !isPackageRequest(request) || allowlist.some((pattern) => matchesPattern(pattern, request));
        if (shouldBundle) {
            callback();
        }
        else {
            callback(null, `commonjs ${request}`);
        }
    };
};
