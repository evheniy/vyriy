#!/usr/bin/env node
import { checkEnv } from '../index.js';
process.exitCode = await checkEnv();
