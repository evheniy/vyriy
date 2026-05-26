import { base } from './base.js';
import { library } from './library.js';
import { api } from './api.js';
import { ssr } from './ssr.js';
import { ssg } from './ssg.js';
import { spa } from './spa.js';
import { rest } from './rest.js';
export const presets = {
    base: {
        name: 'Base',
        description: 'Only configuration',
        preset: base,
    },
    library: {
        name: 'Library',
        description: 'Preset to generate JS/React library',
        preset: library,
    },
    api: {
        name: 'API',
        description: 'Preset to generate simple API',
        preset: api,
    },
    ssr: {
        name: 'SSR',
        description: 'Preset to generate simple Server Side Rendering (SSR) API',
        preset: ssr,
    },
    ssg: {
        name: 'SSG',
        description: 'Preset for Static Site Generation (SSG)',
        preset: ssg,
    },
    spa: {
        name: 'SPA',
        description: 'Preset for Single Page Application (SPA)',
        preset: spa,
    },
    rest: {
        name: 'REST',
        description: 'Preset for simple REST API',
        preset: rest,
    },
};
