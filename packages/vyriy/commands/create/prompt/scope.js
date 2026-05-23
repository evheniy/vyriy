import { prompt } from './prompt.js';
export const scope = async (question, preset, name) => preset === 'base' ? undefined : prompt(question, 'Package scope', `@${name}`);
