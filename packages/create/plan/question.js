export const question = (readline, output) => {
    const queuedLines = [];
    const pendingQuestions = [];
    readline.on('line', (line) => {
        const resolve = pendingQuestions.shift();
        if (resolve) {
            resolve(line);
            return;
        }
        queuedLines.push(line);
    });
    readline.on('close', () => {
        for (const resolve of pendingQuestions.splice(0)) {
            resolve('');
        }
    });
    return (query) => {
        output.write(query);
        const queuedLine = queuedLines.shift();
        if (queuedLine !== undefined) {
            return Promise.resolve(queuedLine);
        }
        return new Promise((resolve) => pendingQuestions.push(resolve));
    };
};
