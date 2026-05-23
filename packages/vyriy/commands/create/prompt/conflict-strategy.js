import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
export const conflictStrategy = async () => {
    console.log('\nWhat should Vyriy do?\n');
    console.log('  1. overwrite existing files');
    console.log('  2. skip existing files');
    console.log('  3. abort');
    const readline = createInterface({ input: stdin, output: stdout });
    try {
        const answer = (await readline.question('\nWhat should Vyriy do? (abort): ')).trim().toLowerCase();
        if (answer === '1' || answer === 'overwrite') {
            return { overwrite: true, skipExisting: false };
        }
        if (answer === '2' || answer === 'skip') {
            return { overwrite: false, skipExisting: true };
        }
        return undefined;
    }
    finally {
        readline.close();
    }
};
