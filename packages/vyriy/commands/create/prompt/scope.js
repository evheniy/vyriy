import { prompt } from './prompt.js';
export const scope = async (question, preset, name) => preset === 'library' ? prompt(question, 'Package scope', `@${name}`) : undefined;
