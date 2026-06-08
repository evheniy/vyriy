import { compose } from './compose.js';
import { withActivity } from './hocs/activity.js';
import { withProfiler } from './hocs/profiler.js';
import { withStrictMode } from './hocs/strict-mode.js';
import { withSuspense } from './hocs/suspense.js';
export const withReact = (Component) => compose(withStrictMode, withSuspense, withActivity, withProfiler)(Component);
