import { readFileSync } from 'node:fs';
import { path } from '@vyriy/path';
let packageJson;
export const getPackage = () => {
    if (!packageJson) {
        packageJson = JSON.parse(readFileSync(path('package.json'), 'utf-8'));
    }
    return packageJson;
};
