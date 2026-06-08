import * as http from 'node:http';
import { listener, streamListener } from './listener.js';
import { listen } from './listen.js';
export const server = (handler) => listen(http.createServer(listener(handler)));
export const streamServer = (handler) => listen(http.createServer(streamListener(handler)));
