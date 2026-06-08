import type { LOG_LEVELS } from './levels.js';
export type LogLevel = (typeof LOG_LEVELS)[number];
export type Log = (level: LogLevel, ...messages: unknown[]) => void;
export type CreateLogger = () => Console;
