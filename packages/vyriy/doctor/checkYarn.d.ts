import { DoctorCheck, DoctorCheckOptions } from './types.js';
export declare const yarnStableFix: {
    readonly label: "Enable Yarn using Corepack";
    readonly command: "corepack enable\ncorepack prepare yarn@stable --activate";
    readonly safeToRun: true;
};
export declare const checkYarn: ({ execCommand, minimumMajor, version, }?: DoctorCheckOptions & {
    readonly minimumMajor?: number;
    readonly version?: string;
}) => Promise<DoctorCheck>;
