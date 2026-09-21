import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import useMobileKeyboardOpener, {
  useMobileKeyboardOpenerOptions,
} from './useMobileKeyboardOpener';

afterEach(cleanup);

function Harness(options: useMobileKeyboardOpenerOptions) {
  useMobileKeyboardOpener(options);
  return (
    <>
      <button id={options.helperId}>helper</button>
      <input id={options.targetId} />
    </>
  );
}

describe('useMobileKeyboardOpener', () => {
  it('focuses the target and calls callback when the helper fires the default click event', () => {
    const callback = vi.fn();
    render(
      <Harness
        helperId="helper-click"
        targetId="target-click"
        callback={callback}
      />,
    );

    fireEvent.click(screen.getByText('helper'));

    expect(document.getElementById('target-click')).toHaveFocus();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('listens on the configured event instead of click', () => {
    const callback = vi.fn();
    render(
      <Harness
        helperId="helper-keyup"
        targetId="target-keyup"
        event="keyup"
        callback={callback}
      />,
    );

    fireEvent.click(screen.getByText('helper'));
    expect(callback).not.toHaveBeenCalled();

    fireEvent.keyUp(screen.getByText('helper'));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('skips focusing when enabled returns false', () => {
    const callback = vi.fn();
    render(
      <Harness
        helperId="helper-enabled"
        targetId="target-enabled"
        callback={callback}
        enabled={() => false}
      />,
    );

    fireEvent.click(screen.getByText('helper'));

    expect(callback).not.toHaveBeenCalled();
    expect(document.getElementById('target-enabled')).not.toHaveFocus();
  });

  it('focuses the target once on mount when focusOnInit is true', () => {
    const callback = vi.fn();
    render(
      <Harness
        helperId="helper-init"
        targetId="target-init"
        callback={callback}
        focusOnInit
      />,
    );

    expect(document.getElementById('target-init')).toHaveFocus();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('passes preventScroll through to target.focus', () => {
    render(
      <Harness
        helperId="helper-scroll"
        targetId="target-scroll"
        preventScroll
      />,
    );
    const target = document.getElementById('target-scroll') as HTMLElement;
    const focusSpy = vi.spyOn(target, 'focus');

    fireEvent.click(screen.getByText('helper'));

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('temporarily unhides a visibility:hidden target to focus it, then hides it again', () => {
    render(<Harness helperId="helper-hidden" targetId="target-hidden" />);
    const target = document.getElementById('target-hidden') as HTMLElement;
    target.style.visibility = 'hidden';

    let visibilityDuringFocus: string | null = null;
    const focusSpy = vi.spyOn(target, 'focus').mockImplementation(() => {
      visibilityDuringFocus = target.style.visibility;
    });

    fireEvent.click(screen.getByText('helper'));

    expect(visibilityDuringFocus).toBe('visible');
    expect(target.style.visibility).toBe('hidden');

    focusSpy.mockRestore();
  });

  it('logs instead of throwing when the target element does not exist', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    function HarnessWithoutTarget() {
      useMobileKeyboardOpener({
        helperId: 'helper-missing',
        targetId: 'does-not-exist-anywhere',
      });
      return <button id="helper-missing">helper</button>;
    }
    render(<HarnessWithoutTarget />);

    expect(() => fireEvent.click(screen.getByText('helper'))).not.toThrow();
    expect(consoleError).toHaveBeenCalledWith(
      'useMobileKeyboardOpener: failed to focus target element',
      expect.anything(),
    );

    consoleError.mockRestore();
  });

  it('re-attaches the listener to the new helper when options change on rerender', () => {
    const callback = vi.fn();

    function ReactiveHarness(props: { helperId: string }) {
      useMobileKeyboardOpener({
        helperId: props.helperId,
        targetId: 'reactive-target',
        callback,
      });
      return (
        <>
          <button id="reactive-helper-a">helper-a</button>
          <button id="reactive-helper-b">helper-b</button>
          <input id="reactive-target" />
        </>
      );
    }

    const { rerender } = render(
      <ReactiveHarness helperId="reactive-helper-a" />,
    );
    rerender(<ReactiveHarness helperId="reactive-helper-b" />);

    fireEvent.click(screen.getByText('helper-a'));
    expect(callback).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText('helper-b'));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('removes the listener on unmount', () => {
    const callback = vi.fn();
    const { unmount } = render(
      <Harness
        helperId="helper-unmount"
        targetId="target-unmount"
        callback={callback}
      />,
    );
    const helper = screen.getByText('helper');

    unmount();
    fireEvent.click(helper);

    expect(callback).not.toHaveBeenCalled();
  });
});
