import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { withReact } from './react.js';
const App = withReact(() => (_jsx("main", { style: {
        alignItems: 'center',
        border: '1px solid #d8dee4',
        borderRadius: '8px',
        display: 'flex',
        minHeight: '160px',
        padding: '24px',
    }, children: _jsxs("div", { children: [_jsx("h1", { style: {
                    fontSize: '24px',
                    margin: '0 0 8px',
                }, children: "App" }), _jsx("p", { style: {
                    margin: 0,
                }, children: "Rendered through withReact." })] }) })));
const meta = {
    title: 'UI/React HOC',
    component: App,
};
export default meta;
export const Example = {};
