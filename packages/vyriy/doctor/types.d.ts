import { ExecCommand } from '../shared/index.js';
export type DoctorCheckLevel = 'ok' | 'warning' | 'error';
export type DoctorFix = {
    readonly label: string;
    readonly command: string;
    readonly safeToRun: boolean;
};
export type DoctorCheck = {
    readonly name: 'node' | 'corepack' | 'yarn' | 'git';
    readonly label: string;
    readonly group: 'Runtime' | 'Package manager' | 'Git';
    readonly level: DoctorCheckLevel;
    readonly message: string;
    readonly detail?: string;
    readonly version?: string;
    readonly fix?: DoctorFix;
};
export type DoctorReport = {
    readonly checks: readonly DoctorCheck[];
    readonly hasErrors: boolean;
    readonly hasWarnings: boolean;
};
export type DoctorCheckOptions = {
    readonly execCommand?: ExecCommand;
};
