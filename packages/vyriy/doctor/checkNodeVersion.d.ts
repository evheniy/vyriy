import { DoctorCheck } from './types.js';
export declare const checkNodeVersion: ({ minimumMajor, version, }?: {
    readonly minimumMajor?: number;
    readonly version?: string;
}) => DoctorCheck;
