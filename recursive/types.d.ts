export type Handler<T> = (item: T) => Promise<unknown>;
export type Recursive = <T>(handler: Handler<T>, list: T[]) => Promise<unknown>;
export type Run = (index?: number) => Promise<unknown>;
