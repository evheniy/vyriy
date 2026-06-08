import { existsEnv, getEnv } from '@vyriy/env';
import { auto, parsers } from './parser.js';
const NO_DEFAULT = Symbol('NO_DEFAULT');
const isParserName = (value) => typeof value === 'string';
const resolveParser = (parser = auto) => isParserName(parser) ? parsers[parser] : parser;
export const getConfig = (envName, defaultValue = NO_DEFAULT, parser = auto) => {
    if (!existsEnv(envName)) {
        if (defaultValue !== NO_DEFAULT && defaultValue !== null) {
            return defaultValue;
        }
        throw new Error(`Environment variable ${envName} is not defined!`);
    }
    return resolveParser(parser)(getEnv(envName));
};
