import type { PrerenderOptions } from './types.js';
declare const prerender: ({ component, bootstrapScripts }: PrerenderOptions) => Promise<import("react-dom/static").PrerenderToNodeStreamResult>;
export { prerender };
