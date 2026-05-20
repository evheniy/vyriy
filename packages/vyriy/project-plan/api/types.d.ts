import { VyriyApiPlan, VyriyApiRuntime, VyriyApiStyle, VyriyFeature, VyriyPreset } from '../types.js';
export type CreateApiPlanOptions = {
    readonly preset: VyriyPreset;
    readonly runtime?: VyriyApiRuntime;
    readonly style?: VyriyApiStyle;
};
export type CreateApiPlan = (options: CreateApiPlanOptions) => VyriyApiPlan | undefined;
export type IsApiPreset = (preset: VyriyPreset) => boolean;
export type GetApiRuntimeFromPreset = (preset: VyriyPreset) => VyriyApiRuntime;
export type GetDefaultApiStyleFromPreset = (preset: VyriyPreset) => VyriyApiStyle;
export type GetFeaturesFromApiPlan = (api: VyriyApiPlan | undefined) => VyriyFeature[];
