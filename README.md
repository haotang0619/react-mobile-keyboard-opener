# React Mobile Keyboard Opener

> A React hook and component to focus an input and trigger the on-screen keyboard on mobile web pages, even when the input you want focused isn't the element the user actually tapped.

iOS Safari and other mobile browsers only pop the soft keyboard when `focus()` happens synchronously inside a real user-interaction event handler (e.g. `click`) — calling it after an `await` or inside a callback won't work. This library wires that up for you: attach a listener to one element (`helperId`), and it focuses another element (`targetId`) inside that same handler.

## Install

```bash
npm install react-mobile-keyboard-opener
# or
yarn add react-mobile-keyboard-opener
```

Peer dependency: `react` / `react-dom` `17`, `18`, or `19`.

## Usage

### Hook

Use the hook when you already have a visible input you want to focus.

```tsx
import useMobileKeyboardOpener from 'react-mobile-keyboard-opener';

function Example() {
  useMobileKeyboardOpener({
    helperId: 'open-search', // element the user taps
    targetId: 'search-input', // element to focus
  });

  return (
    <>
      <button id="open-search">Search</button>
      <input id="search-input" />
    </>
  );
}
```

### Component

Use `MobileKeyboardOpener` when you don't have an input to focus at all — it renders a hidden one for you and focuses that.

```tsx
import { MobileKeyboardOpener } from 'react-mobile-keyboard-opener';

function Example() {
  return (
    <>
      <button id="open-search">Search</button>
      <MobileKeyboardOpener
        helperId="open-search"
        callback={() => console.log('keyboard opened')}
      />
    </>
  );
}
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `helperId` | `string` | *(required)* | id of the element the user interacts with |
| `targetId` | `string` | *(required for the hook; component falls back to its own hidden input)* | id of the element to focus. If you pass this to `MobileKeyboardOpener`, it renders nothing — you already have an element to focus, so there's no hidden input to add |
| `event` | `keyof HTMLElementEventMap` | `'click'` | event on `helperId` that triggers focusing — must be a real user interaction for mobile browsers to allow the keyboard to open |
| `enabled` | `(e: Event) => boolean` | `() => true` | return `false` to skip focusing for this particular event |
| `callback` | `() => void` | `() => null` | called after the target has been focused |
| `preventScroll` | `boolean` | `false` | passed through to `target.focus({ preventScroll })` |
| `focusOnInit` | `boolean` | `false` | hook only — focus `targetId` once on mount, without waiting for `helperId` |

`MobileKeyboardOpener` additionally accepts `inputProps` (`React.InputHTMLAttributes<HTMLInputElement>`), forwarded to the hidden `<input>` it renders when `targetId` is omitted. If `inputProps.id` is set, it's used as the fallback `targetId`; otherwise the fallback is `hidden_input`. `inputProps` is ignored when `targetId` is provided, since no hidden input gets rendered in that case.

## Development

```bash
yarn install
yarn watch   # rollup in watch mode + a local static server for src/iife.tsx
yarn build   # emit dist/cjs, dist/esm, dist/iife, dist/index.d.ts
yarn lint
```

## License

[MIT](./LICENSE) © [Howard Tang](https://github.com/haotang0619)
