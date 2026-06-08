#!/usr/bin/env node
import { runCreateCli } from '@vyriy/create';
await runCreateCli(process.argv.slice(2), 'create-vyriy', false);
