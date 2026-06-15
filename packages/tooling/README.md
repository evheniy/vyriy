# @vyriy/tooling

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/tooling/

CLI for generating thin local tooling config files that delegate to shared Vyriy config packages.

## CLI

Install globally:

```bash
npm install --global @vyriy/tooling
```

Generate default configs:

```bash
vyriy-tooling
vyriy-tooling init
vt init
```

Generate one config:

```bash
vyriy-tooling typescript
vyriy-tooling eslint
vyriy-tooling prettier
vyriy-tooling jest
vyriy-tooling storybook
vyriy-tooling stylelint
```

CLI flags:

- `--force` overwrites existing config files.
- `--dry-run` prints files that would be created without writing them.
- `--help` or `-h` prints command help.
- `--version` or `-v` prints the package version.

After writing files, the CLI prints missing Vyriy config packages that should be installed in the target project.
