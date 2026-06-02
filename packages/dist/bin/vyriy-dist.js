#!/usr/bin/env node
import { dist } from '../index.js';
process.exitCode = await dist();
