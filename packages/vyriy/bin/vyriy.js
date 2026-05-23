#!/usr/bin/env node
import { cli } from '../cli/index.js';
await cli(process.argv.slice(2));
