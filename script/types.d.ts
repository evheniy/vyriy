export type Result = Promise<void>;
export type Task = () => Result;
export type Wrapper<O = void> = (task: Task, options?: O) => Result;
export type Decorator = (task: Task) => Result;
export type Factory = <O = void>(wrapper: Wrapper<O>) => (options?: O) => Decorator;
export type Compose = (...decorators: Decorator[]) => Decorator;
