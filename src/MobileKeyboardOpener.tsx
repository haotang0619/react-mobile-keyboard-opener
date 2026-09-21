import { useEffect, InputHTMLAttributes } from 'react';
import './input.css';
import useMobileKeyboardOpener from './useMobileKeyboardOpener';

type MobileKeyboardOpenerProps = {
  callback?: () => void;
  enabled?: (e: Event) => boolean;
  event?: keyof HTMLElementEventMap; // must be user interactions
  helperId: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  preventScroll?: boolean;
  targetId?: string;
};

export const MobileKeyboardOpener = (props: MobileKeyboardOpenerProps) => {
  const { inputProps, ...options } = props;
  const setOptions = useMobileKeyboardOpener({
    ...options,
    targetId: options.targetId || inputProps?.id || 'hidden_input',
  });
  useEffect(
    () =>
      setOptions((opt) =>
        !!options.targetId
          ? { ...opt, ...options, focusOnInit: true }
          : { ...opt, ...options, targetId: inputProps?.id || 'hidden_input' },
      ),
    [props],
  );

  return (
    <input
      id="hidden_input"
      {...inputProps}
      className={`hidden_input ${inputProps?.className || ''}`}
    />
  );
};
