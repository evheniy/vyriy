import type { ComponentType, JSXElementConstructor, ReactNode } from 'react';
export type Hoc<Props extends object = object> = (Component: ComponentType<Props>) => ComponentType<Props>;
export type ChildrenProps<Props extends object = object, LocalProps extends unknown[] = unknown[]> = (...localProps: LocalProps) => Partial<Props>;
export type WrapperComponent<WrapperProps extends object = object, Children = ReactNode> = JSXElementConstructor<WrapperProps & {
    children: Children;
}>;
