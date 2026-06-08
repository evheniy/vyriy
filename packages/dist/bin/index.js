#!/usr/bin/env node
import { runDistCli } from '../index.js';
await runDistCli(process.argv.slice(2));
