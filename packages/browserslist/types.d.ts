import type { Config } from 'browserslist';
export type BrowserslistEnv = 'development' | 'ssr' | 'production' | 'modern';
export type BrowserslistConfig = Omit<Config, 'defaults'> & Record<BrowserslistEnv, string[]>;
