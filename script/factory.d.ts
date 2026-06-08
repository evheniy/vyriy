import type { Decorator, Wrapper } from './types.js';
export declare const factory: <O = void>(wrapper: Wrapper<O>) => (options?: O) => Decorator;
