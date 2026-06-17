# @vyriy/ssg

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/ssg/

Static Markdown site generator for Vyriy-style content sites.

## Purpose

This package builds a static site from Markdown `README.md` files. It is intended for content-first sites that need HTML pages, section catalogs, MiniSearch data, featured home content, related links, sitemap, robots, and copied public assets without adopting a full framework.

Markdown rendering uses `react-markdown` with GitHub-flavored Markdown and `rehype-highlight`, so content supports tables, task lists, autolinks, and highlighted fenced code blocks.

## CLI

Build a site from `site` into `dist`:

```bash
vyriy-ssg site --output dist
```

The package also exposes the short `ssg` command:

```bash
ssg site -o dist
```

Useful options:

- `--site-url <url>` sets canonical URLs and sitemap locations.
- `--site-name <name>` sets the built-in theme name.
- `--stylesheet <href>` links a stylesheet instead of using the built-in CSS.
- `--stylesheet-file <path>` inlines a stylesheet file.
- `--ga <id>` adds a Google Analytics measurement ID.

## Content

By default, the generator expects this shape:

```txt
site/
  home/README.md
  consulting/README.md
  docs/README.md
  blog/<slug>/README.md
  docs/<slug>/README.md
  examples/<slug>/README.md
  public/
```

Markdown files can include simple frontmatter:

```md
---
title: Calm deployment
description: Deployment notes for calm static sites.
date: 2026-06-16
published: true
homePage: true
tags:
  - ssg
  - deployment
---

# Calm deployment

Page content.
```

## API

```ts
import { buildStaticSite } from '@vyriy/ssg';

await buildStaticSite({
  contentPath: 'site',
  outputPath: 'dist',
  siteUrl: 'https://vyriy.dev',
});
```

Custom sections are supported:

```ts
await buildStaticSite({
  sections: [
    {
      path: 'articles',
      title: 'Articles',
    },
  ],
});
```

Set `index: false` when a section should generate individual pages and search data without its own paginated catalog.

## Exports

- `buildStaticSite(options)` builds the static site.
- `runSsgCli(args)` runs the CLI programmatically.
- `parsePage(markdown)` parses page frontmatter and fallback metadata.
- `renderMarkdown(markdown)` renders Markdown through `react-markdown`, `remark-gfm`, and `rehype-highlight`.
- `renderSitemap(urls, siteUrl)` renders sitemap XML.
- `renderRobotsTxt(siteUrl)` renders robots.txt.
