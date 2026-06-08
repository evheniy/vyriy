import { auto } from './auto.js';
import { boolean } from './boolean.js';
import { csv } from './csv.js';
import { parseDuration as duration } from './duration.js';
import { int, number } from './number.js';
import { json } from './json.js';
import { string } from './string.js';
export { auto } from './auto.js';
export { boolean } from './boolean.js';
export { csv } from './csv.js';
export { parseDuration as duration } from './duration.js';
export { int, number } from './number.js';
export { json } from './json.js';
export { string } from './string.js';
export const parsers = {
    auto,
    string,
    number,
    int,
    boolean,
    csv,
    json,
    duration,
};
export const Parser = parsers;
