import type { Hoc } from './types.js';
export declare const compose: <Props extends object = object>(...hocs: Hoc<Props>[]) => Hoc<Props>;
