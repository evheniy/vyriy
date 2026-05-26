# HTML

This utility builds a complete HTML document string from a small set of optional sections.

## Install

With npm:

```bash
npm install @vyriy/html
```

With Yarn:

```bash
yarn add @vyriy/html
```

## What it does

The function returns a full `<!DOCTYPE html>` page and lets you inject common document pieces:

- attributes for the `<html>` tag
- tags inside `<head>`
- attributes for the `<body>` tag
- body markup and footer-like script sections

Missing sections default to empty strings, so the function always returns the same document shape.

`minify` can be used as an explicit wrapper when the rendered document should not contain line breaks. It removes line breaks from the whole document, including injected style and script sections, while preserving ordinary spaces.

## Signature

```ts
type HtmlProps = {
  htmlAttributes?: string;
  title?: string;
  meta?: string;
  base?: string;
  link?: string;
  style?: string;
  bodyAttributes?: string;
  body?: string;
  noscript?: string;
  script?: string;
};

type Html = (props?: HtmlProps) => string;

type Minify = (html: string) => string;
```

## Example

```ts
import { html } from '@vyriy/html';

const page = html({
  htmlAttributes: 'lang="en"',
  title: '<title>Vyriy</title>',
  meta: '<meta charset="utf-8" />',
  bodyAttributes: 'class="app"',
  body: '<div id="root"></div>',
  script: '<script src="/main.js"></script>',
});
```

Minified output:

```ts
import { html, minify } from '@vyriy/html';

const page = minify(
  html({
    body: '<div id="root"></div>',
    script: `<script>
      window.__APP_READY__ = true;
    </script>`,
  }),
);
```

## Exports

The package exposes both the root entry and the direct utility module:

```ts
import { html } from '@vyriy/html';
import { html as htmlDocument } from '@vyriy/html/html.js';
import { minify } from '@vyriy/html/minify,js';
```

## When to use it

`html` is useful in server-side rendering or static document generation when you want a lightweight document wrapper without bringing in a full templating layer.
