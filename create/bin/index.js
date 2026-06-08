#!/usr/bin/env node
import { runCreateCli } from '../index.js';
await runCreateCli(process.argv.slice(2));
