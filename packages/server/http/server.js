import * as http from 'node:http';
import { listen } from '../listen.js';
import { listener } from './listener.js';
export const server = (handler) => listen(http.createServer(listener(handler)));
