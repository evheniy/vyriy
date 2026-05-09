# ClassNames (cn)

This utility helps build a CSS class string from different kinds of input:

- strings
- objects like `{ className: condition }`
- nested arrays
- `false`, `null`, and `undefined` values that should be ignored

## Install

With npm:

```bash
npm install @vyriy/cn
```

With Yarn:

```bash
yarn add @vyriy/cn
```

## What it does

The function accepts any number of arguments and returns a single space-separated class string.

Behavior:

- string values are added as-is
- `false`, `null`, and `undefined` are ignored
- arrays are flattened recursively
- object keys are included only when their value is truthy

## Signature

```ts
type ClassDictionary = Record<string, boolean | undefined | null>;
type ClassItem = string | ClassDictionary | ClassItem[] | null | undefined | false;
type ClassNames = (...items: ClassItem[]) => string;
```

## Examples

```ts
import { cn } from '@vyriy/cn';

cn('button', 'primary', 'large');
// 'button primary large'

cn('button', false, null, undefined, 'active');
// 'button active'

cn({
  button: true,
  active: true,
  disabled: false,
});
// 'button active'

cn('root', ['nested', [null, { visible: true, collapsed: false }, ['deep']]]);
// 'root nested visible deep'
```

## Exports

The package exposes both the root entry and the direct utility module:

```ts
import { cn } from '@vyriy/cn';
import { cn as classNames } from '@vyriy/cn/cn';
```

## When to use it

`cn` is useful in components where class names depend on state:

```ts
const className = cn('button', {
  'button--active': isActive,
  'button--disabled': isDisabled,
});
```

This keeps the code shorter and avoids manual string concatenation.
