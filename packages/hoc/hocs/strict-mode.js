import { StrictMode } from 'react';
import { builder } from '../builder.js';
export const withStrictMode = (Component) => builder(StrictMode)(Component);
