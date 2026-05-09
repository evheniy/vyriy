import type { ComponentType, ReactNode } from 'react';
import type { ChildrenProps, Hoc, WrapperComponent } from './types.js';
type RenderChildren<LocalProps extends unknown[]> = (...localProps: LocalProps) => ReactNode;
type Builder = {
    <Props extends object, WrapperProps extends object = object, LocalProps extends unknown[] = unknown[]>(WrapperComponent: WrapperComponent<WrapperProps, RenderChildren<LocalProps>>, wrapperProps: WrapperProps | undefined, childrenProps: ChildrenProps<Props, LocalProps>, Component: ComponentType<Props>): ComponentType<Props>;
    <Props extends object, WrapperProps extends object = object>(WrapperComponent: WrapperComponent<WrapperProps, ReactNode>, wrapperProps: WrapperProps | undefined, childrenProps: null | undefined, Component: ComponentType<Props>): ComponentType<Props>;
    <Props extends object, WrapperProps extends object = object>(WrapperComponent: WrapperComponent<WrapperProps, ReactNode>, wrapperProps: WrapperProps, Component: ComponentType<Props>): ComponentType<Props>;
    <Props extends object, WrapperProps extends object = object>(WrapperComponent: WrapperComponent<WrapperProps, ReactNode>, wrapperProps?: WrapperProps): Hoc<Props>;
    <Props extends object = object, WrapperProps extends object = object, LocalProps extends unknown[] = unknown[]>(WrapperComponent: WrapperComponent<WrapperProps, RenderChildren<LocalProps>>, wrapperProps: WrapperProps | undefined, childrenProps: ChildrenProps<Props, LocalProps>): Hoc<Props>;
};
export declare const builder: Builder;
export {};
