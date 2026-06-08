import { Activity } from 'react';
import { builder } from '../builder.js';
export const withActivity = (Component) => builder(Activity)(Component);
