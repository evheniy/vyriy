import type { ReactNode } from 'react';
import type { Root, RootOptions } from 'react-dom/client';
export type ElementOptions = {
    root: Element | null;
    component: ReactNode;
    renderedAttribute?: string;
    options?: RootOptions;
};
export type ElementResult = {
    root: Root;
    unmount: () => void;
};
export type CustomElementRenderElements = {
    elements: readonly Node[];
    root: Element | null;
};
export type CustomElementOptions = {
    tag: string;
    mode?: ShadowRootMode;
    renderedAttribute?: string;
    elements: (customElement: HTMLElement) => CustomElementRenderElements;
    render: (customElement: HTMLElement) => ReactNode;
    options?: RootOptions;
};
export type Html = (component: ReactNode) => string;
export type StreamOptions = {
    component: ReactNode;
    bootstrapScripts?: string[];
};
export type PrerenderOptions = {
    component: ReactNode;
    bootstrapScripts?: string[];
};
