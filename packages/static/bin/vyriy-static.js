#!/usr/bin/env node
import { staticServer } from '../index.js';
process.exitCode = await staticServer({
    directory: process.argv.find((arg, index) => index > 1 && !arg.startsWith('-')) ?? '.',
});
