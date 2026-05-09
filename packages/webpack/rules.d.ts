import type { RuleSetRule } from 'webpack';
export declare const SCRIPT_TEST: RegExp;
export declare const STYLE_TEST: RegExp;
export declare const rules: (isSsr?: boolean, isProduction?: boolean) => RuleSetRule[];
