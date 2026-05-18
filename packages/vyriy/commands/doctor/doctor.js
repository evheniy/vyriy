import { createDoctorReport, printDoctorReport } from '../../doctor/index.js';
export const runDoctorCommand = async ({ output = console } = {}) => {
    const report = await createDoctorReport();
    output.log(printDoctorReport(report));
    return {
        code: report.hasErrors ? 1 : 0,
        checks: report.checks,
    };
};
