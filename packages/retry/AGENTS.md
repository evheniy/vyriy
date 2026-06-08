# Project Agent Guide

This repository follows a calm engineering style: changes should be explicit, reusable, typed, documented, tested, and easy to reason about.

Use this guide as the default behavior for AI agents and contributors working in this repository. Prefer local package conventions when they are more specific than this document.

## Core Principles

- Prefer simple modules over clever frameworks or hidden conventions.
- Keep package and project boundaries explicit.
- Avoid project-specific coupling in reusable code.
- Extract only proven reusable behavior.
- Keep public APIs small, typed, documented, and stable.
- Prefer SSR-friendly and SSG-friendly code paths when working with frontend or shared code.
- Keep integrations replaceable and avoid hard coupling to a CMS, framework, vendor, or runtime host.
- Prefer infrastructure assumptions that are easy to deploy, observe, and replace.
- Prefer the option that is simpler to explain, easier to evolve, and calmer to maintain.

## File Shape

- Prefer one exported runtime method, component, helper, or class per production file when it stays readable.
- Prefer one matching test file per production file, for example `feature.ts` and `feature.test.ts`.
- Use focused folders when behavior naturally splits into several related files.
- Keep `index.ts` as a public re-export surface only. Do not place implementation logic in it.
- Use relative import and export specifiers that match the package module style.
- Use `.js` relative specifiers in TypeScript source for ESM/NodeNext packages.
- Add `types.ts` when public shared types are part of the package contract.
- Keep constants near the code that owns them unless they are shared or clarify repeated behavior.

## Public Surface

- Every new public export must be re-exported from the package or module public entry point.
- Add or update public-surface tests when exports change.
- Add JSDoc for public exports when behavior, parameters, return values, or usage expectations need explanation.
- Avoid exporting internal helpers only to make tests easier.
- Do not hand-maintain package `exports` maps unless the project has a real custom publishing need.

## Tests

- Cover public behavior and meaningful edge cases.
- Prefer behavior-focused tests over private implementation lock-in.
- Keep tests deterministic.
- Avoid real network, filesystem, timers, browser, or cloud dependencies unless the behavior specifically requires them.
- When mocking modules, install mocks before loading the module under test.
- Use focused validation when changing behavior.

Example validation commands:

```bash
yarn test
```

For workspaces, prefer the project convention, for example:

```bash
yarn workspace <package-name> test
```

For Jest-based packages, focused validation may look like:

```bash
yarn jest packages/<package> --runInBand --coverage=false
```

## Documentation

- Keep `README.md` concise and usage-oriented.
- Start package READMEs with `# <package>`.
- Document real public exports, supported options, and examples that actually work.
- Update docs when public behavior changes.
- Keep generated docs wrappers, such as `doc.mdx`, aligned with the README when the project uses them.
- For component packages, include visual documentation or stories for supported states and common usage.

## Components

- Prefer lightweight React components with TypeScript when working in React packages.
- Keep components SSR-friendly and avoid browser globals during render.
- Prefer composable props and predictable ergonomics.
- Put each public component in its own file with a matching test.
- Add stories or examples when a component has visual states, variants, or interaction states.
- Keep styling explicit and reusable. Avoid hidden theme assumptions unless they are part of the package contract.

## Change Discipline

- Keep changes scoped to the requested behavior.
- Avoid unrelated refactors and metadata churn.
- Sync implementation, tests, docs, examples, and public re-exports together.
- Do not introduce new dependencies unless they clearly reduce complexity or are already part of the project direction.
- Prefer small, reviewable changes over broad rewrites.
- Preserve existing conventions unless there is a clear reason to change them.

## Before Finishing

Check that the change is complete:

- Public exports are updated.
- Public-surface tests are updated when exports change.
- Matching unit tests exist for new behavior.
- README examples still match the real API.
- Visual docs, stories, or examples are updated for visible component behavior.
- TypeScript imports follow the package module style.
- No unrelated files, formatting churn, or generated artifacts were changed.
