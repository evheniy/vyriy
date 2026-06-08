import { wrapper } from './wrapper.js';
const createBuilder = (WrapperComponent, wrapperProps = {}, childrenProps = null, Component) => {
    if (!WrapperComponent) {
        throw new Error('WrapperComponent should be set!');
    }
    if (Component) {
        return wrapper(WrapperComponent, wrapperProps, childrenProps, Component);
    }
    return (NewComponent) => {
        if (!NewComponent) {
            throw new Error('Component should be set!');
        }
        return wrapper(WrapperComponent, wrapperProps, childrenProps, NewComponent);
    };
};
export const builder = createBuilder;
