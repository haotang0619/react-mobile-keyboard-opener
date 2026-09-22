import React, { useEffect } from 'react';
import './input.css';
import useMobileKeyboardOpener from './useMobileKeyboardOpener';

type MobileKeyboardOpenerProps = {
  callback?: () => void;
  enabled?: (e: Event) => boolean;
  event?: keyof HTMLElementEventMap; // must be user interactions
  helperId: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  preventScroll?: boolean;
  targetId?: string;
};

export const MobileKeyboardOpener = (props: MobileKeyboardOpenerProps) => {
  const { inputProps, ...options } = props;
  const setOptions = useMobileKeyboardOpener({
    ...options,
    targetId: options?.targetId || inputProps?.id || 'hidden_input',
  });
  useEffect(
    () =>
      setOptions((opt) =>
        !!options?.targetId
          ? { ...opt, ...options, focusOnInit: true }
          : { ...opt, ...options, targetId: inputProps?.id || 'hidden_input' },
      ),
    [props],
  );

  if (options?.targetId) return null;

  return (
    <input
      id="hidden_input"
      {...inputProps}
      className={`hidden_input ${inputProps?.className || ''}`}
    />
  );
};
