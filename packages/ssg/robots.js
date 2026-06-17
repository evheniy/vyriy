import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { getAbsoluteUrl } from './sitemap.js';
export const renderRobotsTxt = (siteUrl) => {
    return [
        'User-agent: *',
        'Allow: /',
        'Disallow: /storybook/',
        `Sitemap: ${getAbsoluteUrl('/sitemap.xml', siteUrl)}`,
        '',
    ].join('\n');
};
export const writeRobotsTxt = async (outputDirectory, siteUrl) => {
    const outputPath = join(outputDirectory, 'robots.txt');
    await mkdir(dirname(outputPath), {
        recursive: true,
    });
    await writeFile(outputPath, renderRobotsTxt(siteUrl));
};
