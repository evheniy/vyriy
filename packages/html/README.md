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

## Exports

The package exposes both the root entry and the direct utility module:

```ts
import { html } from '@vyriy/html';
import { html as htmlDocument } from '@vyriy/html/html';
```

## When to use it

`html` is useful in server-side rendering or static document generation when you want a lightweight document wrapper without bringing in a full templating layer.
