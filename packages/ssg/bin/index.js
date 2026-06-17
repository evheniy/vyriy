#!/usr/bin/env node
import { runSsgCli } from '../index.js';
await runSsgCli(process.argv.slice(2));
