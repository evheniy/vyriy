const statusMark = {
    ok: '✓',
    warning: '!',
    error: '✘',
};
const groups = ['Runtime', 'Package manager', 'Git'];
export const printDoctorReport = (report) => {
    const lines = ['Vyriy Doctor', ''];
    for (const group of groups) {
        const checks = report.checks.filter((check) => check.group === group);
        if (checks.length === 0) {
            continue;
        }
        lines.push(`${group}:`);
        for (const check of checks) {
            lines.push(`  ${statusMark[check.level]} ${check.message}`);
            if (check.detail) {
                lines.push(`    ${check.detail}`);
            }
        }
        lines.push('');
    }
    const fixes = report.checks.flatMap((check) => (check.fix ? [check.fix] : []));
    if (fixes.length > 0) {
        lines.push('Suggested fix:');
        for (const fix of fixes) {
            lines.push(`  ${fix.command.replaceAll('\n', '\n  ')}`);
        }
        lines.push('');
    }
    lines.push('Result:');
    if (report.hasErrors) {
        lines.push('  Environment is not usable.');
    }
    else if (report.hasWarnings) {
        lines.push('  Environment is usable, but warnings should be reviewed.');
    }
    else {
        lines.push('  Environment is usable.');
    }
    return lines.join('\n');
};
