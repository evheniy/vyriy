import { readFile } from 'node:fs/promises';
import { buildStaticSite } from './ssg.js';
const helpText = `Usage:
  ssg <content> [options]
  vyriy-ssg <content> [options]

Options:
  -o, --output <path>       Output directory. Defaults to dist.
  --site-url <url>          Absolute site URL for canonical links and sitemap.
  --site-name <name>        Site name used by the default theme.
  --stylesheet <href>       Stylesheet URL. Omit to use the built-in CSS.
  --stylesheet-file <path>  Inline CSS from a local file.
  --ga <id>                 Google Analytics measurement ID.
  -h, --help                Show this help.
`;
const readValue = (args, index, flag) => {
    const value = args[index + 1];
    if (!value || value.startsWith('-')) {
        throw new Error(`Missing value for ${flag}.`);
    }
    return value;
};
const optionHandlers = {
    '--ga': (args, index, options, arg) => {
        options.googleAnalyticsMeasurementId = readValue(args, index, arg);
    },
    '--output': (args, index, options, arg) => {
        options.outputPath = readValue(args, index, arg);
    },
    '--site-name': (args, index, options, arg) => {
        options.siteName = readValue(args, index, arg);
    },
    '--site-url': (args, index, options, arg) => {
        options.siteUrl = readValue(args, index, arg);
    },
    '--stylesheet': (args, index, options, arg) => {
        options.stylesheetHref = readValue(args, index, arg);
    },
    '--stylesheet-file': async (args, index, options, arg) => {
        options.stylesheetContent = await readFile(readValue(args, index, arg), 'utf8');
    },
    '-o': (args, index, options, arg) => {
        options.outputPath = readValue(args, index, arg);
    },
};
export const parseSsgCliArgs = async (args) => {
    const options = {};
    let contentPath;
    let index = 0;
    while (index < args.length) {
        const arg = args[index] ?? '';
        if (arg === '-h' || arg === '--help') {
            return {
                help: true,
            };
        }
        const optionHandler = optionHandlers[arg];
        if (optionHandler) {
            await optionHandler(args, index, options, arg);
            index += 2;
            continue;
        }
        if (arg.startsWith('-')) {
            throw new Error(`Unknown option: ${arg}`);
        }
        if (contentPath) {
            throw new Error(`Unexpected argument: ${arg}`);
        }
        contentPath = arg;
        index += 1;
    }
    return {
        ...options,
        ...(contentPath ? { contentPath } : {}),
    };
};
export const runSsgCli = async (args = process.argv.slice(2)) => {
    const options = await parseSsgCliArgs(args);
    if (options.help) {
        process.stdout.write(helpText);
        return;
    }
    await buildStaticSite(options);
};
