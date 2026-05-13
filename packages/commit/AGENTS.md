# Vyriy Package Agent Guide

This package belongs to the Vyriy toolkit. Keep changes calm, explicit, reusable, and easy to reason about.

## Architecture

- Prefer simple modules over clever frameworks or hidden conventions.
- Keep package boundaries explicit and avoid project-specific coupling.
- Extract only proven reusable behavior.
- Keep public APIs small, typed, documented, and stable.
- Prefer SSR-friendly and SSG-friendly code paths.
- Keep integrations replaceable and avoid hard coupling to a CMS or runtime host.
- Prefer AWS serverless-compatible assumptions when infrastructure concerns appear.

## File Shape

- Prefer one exported runtime method, component, or helper per production file when it stays readable.
- Prefer one matching test file per production file, for example `feature.ts` and `feature.test.ts`.
- Use focused folders when behavior naturally splits into several related files.
- Keep `index.ts` as a public re-export surface only. Do not place implementation logic in it.
- Use `.js` relative import and export specifiers in TypeScript source where package style requires it.
- Add `types.ts` when public shared types are part of the package contract.
- Keep constants near the code that owns them unless they are shared or clarify repeated behavior.

## Public Surface

- Every new public export should be re-exported from `index.ts`.
- Add or update `index.test.ts` when the public export surface changes.
- Add JSDoc for public exports when behavior, parameters, return values, or usage expectations need explanation.
- Do not hand-maintain source package `exports` maps unless the package has a real custom publishing need.

## Tests

- Tests use Jest and `@jest/globals`.
- Cover public behavior and meaningful edge cases.
- Prefer behavior-focused tests over private implementation lock-in.
- When mocking modules, install mocks before loading the module under test.
- Use focused validation when changing package behavior:

```bash
yarn jest packages/<package> --runInBand --coverage=false
```

## Documentation

- Keep `README.md` concise and usage-oriented.
- Start package READMEs with `# @vyriy/<package>`.
- Document real public exports, supported options, and examples that actually work.
- Keep `doc.mdx` as the Storybook/docs wrapper for the README when the package participates in docs.
- For component packages, include Storybook coverage for supported states and common usage.

## Components

- Prefer lightweight React 19+ components with TypeScript.
- Keep components SSR-friendly and avoid browser globals during render.
- Prefer composable props and Bootstrap-compatible ergonomics where practical.
- Put each public component in its own file with a matching test.
- Add Storybook stories when a component has visual states, variants, or interaction states.

## Change Discipline

- Keep changes scoped to the requested behavior.
- Avoid unrelated refactors and metadata churn.
- Sync implementation, tests, README, `doc.mdx`, and public re-exports together.
- Prefer the option that is simpler to explain, easier to evolve, and calmer to maintain.
