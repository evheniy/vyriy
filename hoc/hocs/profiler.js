import { Profiler } from 'react';
import { builder } from '../builder.js';
const onRender = () => { };
export const withProfiler = (Component) => builder(Profiler, {
    id: 'profiler',
    onRender,
})(Component);
