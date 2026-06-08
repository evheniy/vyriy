import { presets as appPreset } from '../preset/index.js';
import type { PromptOutput, PromptQuestion } from './types.js';
export type PresetName = keyof typeof appPreset;
export declare const preset: (question: PromptQuestion, output: PromptOutput) => Promise<PresetName>;
