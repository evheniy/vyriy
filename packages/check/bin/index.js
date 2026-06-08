#!/usr/bin/env node
import { runCheckCli } from '../index.js';
await runCheckCli(process.argv.slice(2));
