import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { createDoctorReport, printDoctorReport } from '../../doctor/index.js';
import { createFilePlan, printFilePlan, writeFilePlan } from '../../file-plan/index.js';
import { createProjectFiles } from '../../presets/index.js';
import { askProjectPlan as askProjectPlanDefault } from '../../prompts/project-plan/index.js';
import { createProjectPlanFromPreset, printProjectPlan } from '../../project-plan/index.js';
const getConflicts = (filePlan) => filePlan.filter((item) => item.status === 'conflict');
const logConflicts = (output, conflicts, method) => {
    output[method]('\nExisting files found:\n');
    for (const conflict of conflicts) {
        output[method](`  ! ${conflict.path}`);
    }
};
const printConflictPrompt = (output) => {
    output.log('\nWhat should Vyriy do?');
    output.log('  1. overwrite existing files');
    output.log('  2. skip existing files');
    output.log('  3. abort');
};
const failOnNonInteractiveConflicts = (output, conflicts) => {
    logConflicts(output, conflicts, 'error');
    output.error('\nCannot continue in non-interactive mode without a conflict strategy.\n');
    output.error('Use one of:\n\n  vyriy --overwrite\n  vyriy --skip-existing\n  vyriy --dry-run');
    return 1;
};
const createResolvedFilePlan = async (plan, projectFiles, resolution) => createFilePlan(plan.targetDirectory, projectFiles, {
    overwrite: resolution === 'overwrite',
    skipExisting: resolution === 'skip',
});
const resolveInteractiveConflicts = async (plan, projectFiles, output, conflicts, askConflictResolution) => {
    logConflicts(output, conflicts, 'log');
    printConflictPrompt(output);
    const resolution = await askConflictResolution();
    if (resolution === 'abort') {
        output.log('Project generation aborted.');
        return { result: 1, status: 'failed' };
    }
    const filePlan = await createResolvedFilePlan(plan, projectFiles, resolution);
    if (getConflicts(filePlan).length > 0) {
        output.error('Cannot continue with unresolved file conflicts.');
        return { result: 1, status: 'failed' };
    }
    return { filePlan, status: 'resolved' };
};
export const askConflictResolutionDefault = async () => {
    const readline = createInterface({ input: stdin, output: stdout });
    try {
        const answer = (await readline.question('What should Vyriy do? 1. overwrite existing files, 2. skip existing files, 3. abort (abort): '))
            .trim()
            .toLowerCase();
        if (answer === '1' || answer === 'overwrite') {
            return 'overwrite';
        }
        if (answer === '2' || answer === 'skip') {
            return 'skip';
        }
        return 'abort';
    }
    finally {
        readline.close();
    }
};
export const runNewCommand = async ({ askConflictResolution = askConflictResolutionDefault, askProjectPlan = askProjectPlanDefault, dryRun = false, output = console, overwrite = false, projectName = 'my-app', skipExisting = false, yes = false, } = {}) => {
    if (overwrite && skipExisting) {
        output.error('Cannot use --overwrite and --skip-existing together.');
        return 1;
    }
    const report = await createDoctorReport();
    output.log(printDoctorReport(report));
    if (report.hasErrors) {
        output.error('\nPlease install Node.js 24+ and run the command again.');
        return 1;
    }
    const plan = dryRun || yes
        ? createProjectPlanFromPreset({
            apiStyle: 'rest',
            ciProvider: 'none',
            description: 'Calm cloud-ready application.',
            packageScope: `@${projectName}`,
            preset: 'react-ssr',
            projectName,
            targetDirectory: projectName,
        })
        : await askProjectPlan({
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
    const projectFiles = createProjectFiles(plan);
    let filePlan = await createFilePlan(plan.targetDirectory, projectFiles, { overwrite, skipExisting });
    let conflicts = filePlan.filter((item) => item.status === 'conflict');
    output.log(`\n${printFilePlan(filePlan)}`);
    if (dryRun) {
        output.log('\nNo files will be written in dry-run mode.');
        return conflicts.length > 0 ? 1 : 0;
    }
    if (conflicts.length > 0 && yes) {
        return failOnNonInteractiveConflicts(output, conflicts);
    }
    if (conflicts.length > 0) {
        const resolved = await resolveInteractiveConflicts(plan, projectFiles, output, conflicts, askConflictResolution);
        if (resolved.status === 'failed') {
            return resolved.result;
        }
        filePlan = resolved.filePlan;
        output.log(`\n${printFilePlan(resolved.filePlan)}`);
    }
    await writeFilePlan(plan.targetDirectory, filePlan);
    output.log('\nProject files written.');
    return 0;
};
