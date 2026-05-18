import { DoctorCheck } from '../../doctor/index.js';
export type RunDoctorCommandOptions = {
    readonly output?: Pick<typeof console, 'log' | 'error'>;
};
export type RunDoctorCommand = (options?: RunDoctorCommandOptions) => Promise<{
    readonly code: number;
    readonly checks: readonly DoctorCheck[];
}>;
