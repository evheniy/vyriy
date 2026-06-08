import { jsx as _jsx } from "react/jsx-runtime";
import { Suspense } from 'react';
import { builder } from '../builder.js';
export const withSuspense = (Component) => builder(Suspense, {
    fallback: _jsx("div", { children: "Loading..." }),
})(Component);
