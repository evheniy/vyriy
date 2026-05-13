import { checkNodeVersion } from '../../checks/node/index.js';
import { checkYarnVersion } from '../../checks/yarn/index.js';
import { askProjectPlan as askProjectPlanDefault } from '../../prompts/project-plan/index.js';
import { printProjectPlan } from '../../project-plan/index.js';
export const runNewCommand = async ({ askProjectPlan = askProjectPlanDefault, output = console, projectName = 'my-app', } = {}) => {
    const nodeCheck = checkNodeVersion();
    if (!nodeCheck.ok) {
        output.error(nodeCheck.message);
        return 1;
    }
    const yarnCheck = await checkYarnVersion();
    if (!yarnCheck.ok) {
        output.error(yarnCheck.message);
        return 1;
    }
    output.log(`OK ${nodeCheck.message}`);
    output.log(`OK ${yarnCheck.message}\n`);
    const plan = await askProjectPlan({
        defaults: {
            projectName,
            targetDirectory: projectName,
        },
    });
    if (!plan) {
        output.log('Project planning cancelled.');
        return 1;
    }
    output.log(`\n${printProjectPlan(plan)}`);
    output.log('Project plan created.\n');
    output.log('File generation is not implemented yet.');
    return 0;
};
