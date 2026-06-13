import type { HttpHandler } from '@vyriy/handler';
import type { Server } from '../types.js';
export type Handler = HttpHandler;
export type CreateServer = (handler: Handler) => Server;
