#!/usr/bin/env node
import { runVyriyCli } from '../cli/index.js';
await runVyriyCli(process.argv.slice(2));
