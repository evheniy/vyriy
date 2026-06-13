import * as http from 'node:http';
import { listener } from './listener.js';
import { listen } from './listen.js';
export const server = (handler) => listen(http.createServer(listener(handler)));
