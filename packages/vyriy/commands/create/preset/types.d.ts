import type { PlanResult } from '../plan/types.js';
export type FileMap = Record<string, string>;
export type CiProvider = 'gitlab' | 'github';
export type DeployProvider = 'aws' | 'docker';
export type Preset = {
    files: (options: PlanResult) => FileMap;
    ci: Partial<Record<CiProvider, FileMap>>;
    deploy: Partial<Record<DeployProvider, FileMap>>;
};
export type PresetKey = 'base' | 'library' | 'api' | 'ssr' | 'rest' | 'gql' | 'ssg' | 'spa' | 'mfe';
export type Presets = Partial<Record<PresetKey, {
    name: string;
    description: string;
    preset: Preset;
}>>;
