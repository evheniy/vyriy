import { base } from './base.js';
import { library } from './library.js';
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
};
