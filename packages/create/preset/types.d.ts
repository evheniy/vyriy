import type { PlanResult } from '../plan/types.js';
export type FileMap = Record<string, string>;
export type Preset = (options: PlanResult) => FileMap;
export type PresetKey = 'base' | 'library' | 'api' | 'mcp' | 'ssr' | 'rest' | 'gql' | 'ssg' | 'spa' | 'mfe' | 'fullstack';
export type Presets = Partial<Record<PresetKey, {
    name: string;
    description: string;
    preset: Preset;
}>>;
