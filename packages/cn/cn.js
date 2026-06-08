export const cn = (...items) => {
    const classes = [];
    const process = (item) => {
        if (!item)
            return;
        if (typeof item === 'string') {
            classes.push(item);
            return;
        }
        if (Array.isArray(item)) {
            for (const sub of item)
                process(sub);
            return;
        }
        for (const [key, value] of Object.entries(item)) {
            if (value)
                classes.push(key);
        }
    };
    for (const item of items) {
        process(item);
    }
    return classes.join(' ');
};
