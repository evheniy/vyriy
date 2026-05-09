import { jsx as _jsx } from "react/jsx-runtime";
const createWrapper = (WrapperComponent, wrapperProps = {}, childrenProps = null, Component) => {
    const WrappedComponent = (props) => {
        if (childrenProps) {
            return (_jsx(WrapperComponent, { ...wrapperProps, ...props, children: (...localProps) => _jsx(Component, { ...props, ...childrenProps(...localProps) }) }));
        }
        return (_jsx(WrapperComponent, { ...wrapperProps, ...props, children: _jsx(Component, { ...props }) }));
    };
    return WrappedComponent;
};
export const wrapper = createWrapper;
