import { checkNodeVersion } from '../../checks/node/index.js';
import { checkYarnVersion } from '../../checks/yarn/index.js';
export const runDoctorCommand = async ({ output = console } = {}) => {
    const checks = [checkNodeVersion(), await checkYarnVersion()];
    const failedCheck = checks.find((check) => !check.ok);
    output.log('Vyriy Project Master\n');
    for (const check of checks) {
        output.log(`${check.ok ? 'OK' : 'ERROR'} ${check.message}`);
    }
    if (failedCheck) {
        return {
            code: 1,
            checks,
        };
    }
    return {
        code: 0,
        checks,
    };
};
