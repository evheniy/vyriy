#!/usr/bin/env node
import { create } from '../index.js';
const args = process.argv.slice(2);
const directory = args.find((arg) => !arg.startsWith('-')) ?? '';
const dryRun = args.includes('--dry-run');
const overwrite = args.includes('--overwrite');
const skipExisting = args.includes('--skip-existing');
const install = !args.includes('--no-install');
const verify = install && !args.includes('--no-verify');
process.exitCode = await create({
    directory,
    dryRun,
    overwrite,
    skipExisting,
    install,
    verify,
});
