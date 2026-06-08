import type { Server } from './types.js';
type Signal = 'SIGINT' | 'SIGTERM';
export declare const shutdown: (server: Server, signal: Signal) => void;
export declare const graceful: (server: Server) => void;
export {};
