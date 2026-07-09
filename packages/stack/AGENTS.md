# Vyriy Package Agent Guide

This guide applies to everything under `packages/*`.

Always read the root `AGENTS.md` first for current project direction, then use this package guide as the stricter local contract for package work. If the root guide gains new package-relevant knowledge, sync it here in the same change or in the next package-touching change so this file does not drift behind.

## Package Principles

- Keep packages small, explicit, typed, documented, tested, and easy to reason about.
- Prefer calm reusable contracts over project-specific shortcuts.
- Keep every package responsible for one clear capability or closely related capability group.
- Keep public APIs small and intentional.
- Prefer SSR-friendly, SSG-friendly, and runtime-agnostic code paths.
- Avoid hidden framework, CMS, browser, filesystem, network, or cloud assumptions unless they are the package contract.
- Add packages only when they reduce real complexity, clarify boundaries, or improve reuse.
- Prefer the option that is simpler to explain, easier to evolve, and calmer to maintain.
- Grow package functionality in small, calm, reviewable steps that are easy to test and continue.

## Standard Package Shape

Use `packages/pause` as the default structural template for ordinary runtime packages.

Expected files for a typical package:

- `README.md`
- `doc.mdx`
- `index.ts`
- `index.test.ts` when public re-exports need coverage
- `package.json`
- `<package>.ts`
- `<package>.test.ts`
- `types.ts` when public shared types are part of the package contract

Package-local build configs are not the default. Add them only when a package has a real special-purpose build shape.

## File Responsibility

- Prefer one exported runtime method, component, helper, class, or factory per production file when it stays readable.
- Keep types in `types.ts` or focused type files when they are public, reused, or make runtime code noisy.
- Keep implementation code separate from type-only contracts when that improves readability or reuse.
- Prefer one matching test file per production file, for example `feature.ts` and `feature.test.ts`.
- Use focused folders when behavior naturally splits into several related files.
- Inside focused folders, prefer short file names because the folder path already carries part of the meaning.
- Keep `index.ts` as a public re-export surface only. Do not place implementation logic in it.
- Keep constants near the code that owns them unless they are shared, clarify intent, or reduce repeated noise.
- Avoid exporting internal helpers only to make tests easier.

## Imports And Exports

- Use relative import and export specifiers that match the package module style.
- Use `.js` relative specifiers in TypeScript source for ESM/NodeNext packages.
- Re-export every public runtime export from the package public entry point.
- Re-export public types with `export type`.
- Add or update `index.test.ts` when public exports change.
- Do not hand-maintain package `exports` maps in source manifests unless the package has a real custom publishing need.

Example:

```ts
export * from './feature.js';
export type * from './types.js';
```

## Package Manifest

Keep source `package.json` files minimal and let `build:dist` generate publishing metadata where possible.

Typical runtime package fields:

- `"private": true`
- `"type": "module"`
- `"engines": { "node": ">=24.0.0" }`
- `"main": "index.js"` when the package has a runtime entry
- runtime dependencies only when package source imports them at runtime

## Documentation Is Required

Documentation must move with code. Do not finish a package change while docs describe a different API than the implementation.

- Every package must have a concise, usage-oriented `README.md`.
- Every ordinary package should have `doc.mdx`, normally wrapping the package README in the Storybook/docs style used by `packages/pause/doc.mdx`.
- Start package READMEs with `# @vyriy/<package>`.
- Document real public exports, supported options, behavior expectations, and examples that actually work.
- Update README examples whenever imports, parameters, return values, configuration, or behavior changes.
- Keep `doc.mdx` aligned with the README and package title when packages are added, renamed, or reorganized.
- Add or update JSDoc for public exports when behavior, parameters, return values, errors, side effects, or usage expectations need explanation.
- For component packages, include visual documentation, stories, or examples for supported states, variants, and interaction states.
- Keep reusable components as dumb as practical: push data shaping, stateful orchestration, and demo-specific logic into the entry point or owning composition layer.
- Store demo data in stories instead of embedding it in reusable component source.
- Avoid broad architecture essays in package READMEs; keep architectural direction in root-level docs unless it is necessary to use the package.

## Tests Are Required

Tests should protect public behavior and meaningful regression risk.

- Add or update Jest tests for changed public behavior, public exports, and meaningful edge cases.
- Add a real test immediately for new packages. If behavior is not finalized, add a valid placeholder test with a clear public API expectation.
- Prefer behavior-focused tests over private implementation lock-in.
- Keep tests deterministic and avoid real network, timers, browser, filesystem, or cloud dependencies unless that dependency is the behavior under test.
- Mock external dependencies from `node_modules` in unit tests so package behavior stays deterministic and local.
- When mocking modules, install mocks before loading the module under test.
- Use `@jest/globals` in Jest tests.
- Keep coverage enabled for normal validation. The shared Jest config in `packages/jest/index.ts` requires 100% global coverage for branches, functions, lines, and statements.
- For small changes, run Jest against the changed tests or changed package with coverage enabled. For larger package changes, public API changes, or cross-package changes, run the full Jest suite with coverage.

Typical package test naming:

- `<package>.test.ts` for single-file packages
- `<feature>.test.ts` for multi-entry packages
- `index.test.ts` for public re-export coverage

## Quality Gate

Before finishing package work, keep the package surface synchronized and run focused validation.

Required sync checks:

- implementation matches public types
- public exports are updated
- public-surface tests are updated when exports change
- unit tests cover new or changed behavior
- `README.md` matches the actual API and examples
- `doc.mdx` exists and points at the correct README/title for ordinary packages
- JSDoc is updated for public API changes that need explanation
- source manifests stay minimal and accurate
- `.js` relative specifiers are used where required
- no unrelated refactors, formatting churn, or generated artifacts are included

Preferred validation commands:

```bash
yarn tsc --pretty false
yarn eslint <changed files or package>
yarn prettier --check <changed files or package>
yarn jest <changed tests or package> --runInBand
```

Run ESLint after YAML/YML changes too, for example `yarn eslint <changed.yml>`, because the repo ESLint setup validates YAML files as well.

Also run `yarn build:dist` for package export, manifest, build-shape, or generated-dist behavior changes. After larger package or library changes, run the full Jest suite with coverage and prefer building the affected library/package as an additional confidence check.

If a required validation command cannot be run, state why and report the remaining risk.

## New Package Checklist

When creating a new workspace package `@vyriy/<package>`:

1. Create `packages/<package>`.
2. Mirror `packages/pause` unless the package purpose clearly requires a different shape.
3. Replace `pause` references with the new package name, exported symbols, types, metadata, paths, README, and docs title.
4. Keep implementation, public types, tests, README, `doc.mdx`, public exports, and manifest in sync from the first change.
5. Keep `.js` relative import/export specifiers.
6. Add a real test immediately, or a valid placeholder test with a clear public API expectation when behavior is not finalized.
7. Keep source `package.json` minimal and let `build:dist` generate publish metadata.
8. Run relevant type, lint, format, test, and build checks.

## Change Discipline

- Keep changes scoped to the requested package behavior.
- Prefer small, reviewable changes over broad rewrites.
- Split multi-responsibility files into cohesive modules when it makes behavior easier to understand, test, or reuse.
- Avoid abstraction for its own sake.
- Do not introduce new dependencies unless they clearly reduce complexity or are already part of the project direction.
- Preserve existing package conventions unless there is a clear reason to change them.
- Never leave package docs, tests, exports, or public types behind the implementation.
- When you learn something package-relevant while working, update the nearest durable guide or docs so future package work starts from that knowledge.
