import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MobileKeyboardOpener } from './MobileKeyboardOpener';

afterEach(cleanup);

describe('MobileKeyboardOpener', () => {
  it('focuses the default hidden input when no targetId or inputProps.id is given', () => {
    const callback = vi.fn();
    render(
      <>
        <button id="helper-default">helper</button>
        <MobileKeyboardOpener helperId="helper-default" callback={callback} />
      </>,
    );

    fireEvent.click(screen.getByText('helper'));

    expect(document.getElementById('hidden_input')).toHaveFocus();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('uses inputProps.id as the focus target when targetId is omitted', () => {
    const callback = vi.fn();
    render(
      <>
        <button id="helper-custom-id">helper</button>
        <MobileKeyboardOpener
          helperId="helper-custom-id"
          callback={callback}
          inputProps={{ id: 'my-custom-input' }}
        />
      </>,
    );

    fireEvent.click(screen.getByText('helper'));

    expect(document.getElementById('my-custom-input')).toHaveFocus();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('forwards inputProps and merges className with hidden_input', () => {
    render(
      <MobileKeyboardOpener
        helperId="helper"
        inputProps={{
          id: 'my-input',
          className: 'extra',
          title: 'search',
        }}
      />,
    );
    const input = document.getElementById('my-input') as HTMLInputElement;

    expect(input.className).toBe('hidden_input extra');
    expect(input.title).toBe('search');
  });

  it('accepts input-specific inputProps like placeholder and type', () => {
    render(
      <MobileKeyboardOpener
        helperId="helper"
        inputProps={{ id: 'my-input', placeholder: 'search', type: 'text' }}
      />,
    );
    const input = document.getElementById('my-input') as HTMLInputElement;

    expect(input.placeholder).toBe('search');
    expect(input.type).toBe('text');
  });

  it('focuses targetId on mount when targetId is provided directly', () => {
    render(
      <>
        <input id="existing-target" />
        <MobileKeyboardOpener
          helperId="does-not-matter"
          targetId="existing-target"
        />
      </>,
    );

    expect(document.getElementById('existing-target')).toHaveFocus();
  });
});
