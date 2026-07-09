# @vyriy/ssg

Static generation helpers for `vyriy.dev`.

## Usage

```ts
import { buildStaticSite } from '@vyriy/ssg';

await buildStaticSite();
```

By default, `buildStaticSite` renders:

- `site/home/README.md` to `dist/index.html`
- `site/docs/README.md` to `dist/docs/index.html`
- `site/docs/**/README.md` to `dist/docs/**/index.html`
- `site/blog/**/README.md` to `dist/blog/**/index.html`
- `site/examples/**/README.md` to `dist/examples/**/index.html`
- generated docs, blog, and example entries to sibling `.md` files such as
  `dist/docs/ssg.md`, `dist/blog/post.md`, and `dist/examples/demo.md`
- `site/consulting/README.md` to `dist/consulting/index.html`
- `dist/blog/index.html` and `dist/examples/index.html` catalog pages, plus
  numbered catalog pages when pagination is needed
- `dist/404.html`
- `dist/sitemap.xml`, `dist/robots.txt`, and `dist/llms.txt`

When the script is executed from `dist`, it reads content from the parent project
directory and writes into the current `dist` directory. Blog, documentation, and
example entries with `published: false` are skipped.

Vyriy SSG can emit `.md` versions of generated content pages next to HTML
pages. This gives agents, LLM tools, and crawlers a clean text representation of
docs, blog posts, and examples while preserving the normal human-facing HTML
site. Generated content HTML pages also include a
`<link rel="alternate" type="text/markdown">` tag that points to the Markdown
artifact. The generated home page includes lightweight discovery `<link>` tags
for `/llms.txt`, `/docs/`, and `/sitemap.xml`.

## Exports

- `buildStaticSite` builds the static home page, documentation page, consulting
  page, 404 page, blog pages, example pages, and section index pages.
- `renderRobotsTxt` and `writeRobotsTxt` create a crawler policy that allows all
  indexing, points to the sitemap, and emits permissive content signals for
  search and AI usage.
- `renderLlmTxt` and `writeLlmTxt` create a readable LLM index for main pages
  and published content sections.
- `getWebPageJsonLd` and `renderJsonLdScript` create safe WebPage JSON-LD for
  rendered HTML documents.
- `renderMarkdownPage`, `writeMarkdownPage`, and `getMarkdownOutputPath` create
  agent-readable Markdown artifacts for generated content pages.
- `BuildStaticSiteOptions` configures source, output, stylesheet, Google
  Analytics measurement ID, and current working directory paths.
- `PageData` describes parsed Markdown page content and metadata.
