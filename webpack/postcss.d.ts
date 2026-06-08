import type { AcceptedPlugin, ProcessOptions } from 'postcss';
export type PostcssConfig = ProcessOptions & {
    plugins: AcceptedPlugin[];
};
export declare const postcss: (config?: Partial<PostcssConfig>) => PostcssConfig;
