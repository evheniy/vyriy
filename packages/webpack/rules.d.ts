import type { RuleSetRule } from 'webpack';
import type { WebpackStyleMode, WebpackStyleRuleOptions } from './types.js';
export declare const SCRIPT_TEST: RegExp;
export declare const STYLE_TEST: RegExp;
export declare const style: ({ mode }?: WebpackStyleRuleOptions) => RuleSetRule;
export declare const rules: (isSsr?: boolean, isProduction?: boolean, styleMode?: WebpackStyleMode) => RuleSetRule[];
