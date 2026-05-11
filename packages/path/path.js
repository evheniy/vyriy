import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';
export const path = (...pathSegments) => resolve(realpathSync(process.env.PROJECT_CWD || process.cwd()), ...pathSegments);
