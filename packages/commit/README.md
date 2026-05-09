# @vyriy/commit

Helper for validating commit message text in Vyriy projects.

## Purpose

This package reads `.git/COMMIT_EDITMSG` and checks the commit message against a custom validation rule.

If the message is invalid, it:

- prints an error message
- prints additional usage guidance
- exits the process with code `1`

Merge commits and auto-merging messages are ignored.

## Install

With npm:

```bash
npm install @vyriy/commit
```

With Yarn:

```bash
yarn add @vyriy/commit
```

## Usage

Example `bin/commit.js`:

```js
#!/usr/bin/env node

import { commit } from '@vyriy/commit';

commit({
  rule: /[A-Z]{2,}-[0-9]+(,[A-Z]{2,}-[0-9]+)*/,
  error: 'Wrong commit format!',
  info: [
    'It must be a Jira ticket id or a sequence of Jira ticket ids separated by commas.',
    'For example -> fix(JT-123): fixing something',
  ].join('\n'),
});
```

This is useful in local git hooks, for example in `commit-msg`.

## Husky

This package can be used together with Husky.

Example `.husky/commit-msg`:

```sh
#!/bin/sh

node bin/commit.js
```

## API

`commit(params)`

- `params.rule`: regular expression used to validate the commit message
- `params.error`: message printed when validation fails
- `params.info`: additional instructions shown after the error message

## Notes

- the package reads the message from `.git/COMMIT_EDITMSG`
- invalid messages terminate the current process with exit code `1`
- merge commit messages are allowed without custom validation
