#!/usr/bin/env node
import { runStaticCli } from '../index.js';
await runStaticCli(process.argv.slice(2));
