import type { Corepack } from './types.js';
export declare const corepack: Corepack;
export declare const activateYarnStable: () => Promise<{
    ok: boolean;
    message: string;
}>;
