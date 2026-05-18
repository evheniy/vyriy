const sections = [
    [
        'create',
        'CREATE',
        '+',
        'to create',
    ],
    [
        'overwrite',
        'OVERWRITE',
        '~',
        'to overwrite',
    ],
    [
        'skip',
        'SKIP',
        '-',
        'to skip',
    ],
    [
        'conflict',
        'CONFLICT',
        '!',
        'conflict',
    ],
];
export const printFilePlan = (plan) => {
    const lines = ['File plan:', ''];
    for (const [status, title, marker] of sections) {
        const items = plan.filter((item) => item.status === status);
        if (items.length === 0) {
            continue;
        }
        lines.push(title, ...items.map((item) => `  ${marker} ${item.path}`), '');
    }
    lines.push('Summary:');
    for (const [status, , , label,] of sections) {
        const count = plan.filter((item) => item.status === status).length;
        if (count > 0) {
            lines.push(`  ${count} ${label}${status === 'conflict' && count !== 1 ? 's' : ''}`);
        }
    }
    return lines.join('\n');
};
