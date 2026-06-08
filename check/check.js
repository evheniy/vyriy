import { activateYarnStable, corepack } from './corepack.js';
import { node } from './node.js';
import { yarn } from './yarn.js';
export const checkEnv = async () => {
    const nodeResults = node();
    console.log('Check env:');
    if (nodeResults.ok) {
        console.log(' ', nodeResults.message);
    }
    else {
        console.error(nodeResults.message);
        return 1;
    }
    const corepackResults = await corepack();
    if (corepackResults.ok) {
        console.log(' ', corepackResults.message);
    }
    else {
        console.error(corepackResults.message);
        return 1;
    }
    let yarnResults = await yarn();
    if (yarnResults.ok) {
        console.log(' ', yarnResults.message);
        return 0;
    }
    const yarnStableResults = await activateYarnStable();
    if (yarnStableResults.ok) {
        console.log(' ', yarnStableResults.message);
    }
    else {
        console.error(yarnStableResults.message);
        return 1;
    }
    yarnResults = await yarn();
    if (yarnResults.ok) {
        console.log(' ', yarnResults.message);
    }
    else {
        console.error(yarnResults.message);
        return 1;
    }
    return 0;
};
