import type { ComponentType, ReactNode } from 'react';
import type { ChildrenProps, WrapperComponent } from './types.js';
type RenderChildren<LocalProps extends unknown[]> = (...localProps: LocalProps) => ReactNode;
type Wrapper = {
    <Props extends object, WrapperProps extends object = object, LocalProps extends unknown[] = unknown[]>(WrapperComponent: WrapperComponent<WrapperProps, RenderChildren<LocalProps>>, wrapperProps: WrapperProps, childrenProps: ChildrenProps<Props, LocalProps>, Component: ComponentType<Props>): ComponentType<Props>;
    <Props extends object, WrapperProps extends object = object>(WrapperComponent: WrapperComponent<WrapperProps, ReactNode>, wrapperProps: WrapperProps, childrenProps: null, Component: ComponentType<Props>): ComponentType<Props>;
    <Props extends object, WrapperProps extends object = object, LocalProps extends unknown[] = unknown[]>(WrapperComponent: WrapperComponent<WrapperProps, ReactNode | RenderChildren<LocalProps>>, wrapperProps: WrapperProps, childrenProps: ChildrenProps<Props, LocalProps> | null, Component: ComponentType<Props>): ComponentType<Props>;
};
export declare const wrapper: Wrapper;
export {};
