import * as React from 'react';
import { createRoot } from 'react-dom/client';
import useMobileKeyboardOpener, { MobileKeyboardOpener } from './index';

const App = () => {
  const setOptions = useMobileKeyboardOpener({
    callback: () => console.log('callback (target)'),
    enabled: (e) => /[0-9]/.test(e.key),
    event: 'keyup',
    helperId: 'helper',
    targetId: 'target',
  });
  const [targetId, setTargetId] = React.useState('');
  const [val, setVal] = React.useState('');
  React.useEffect(() => console.log(val), [val]);

  React.useEffect(() => {
    setTimeout(() => {
      setOptions((opt) => ({
        ...opt,
        callback: () => console.log('callback (new_target)'),
        enabled: () => true,
        event: 'click',
        helperId: 'new_helper',
        targetId: 'new_target',
      }));

      setTargetId('new_target');
    }, 5000);
  }, []);

  return (
    <>
      <input
        id="helper"
        placeholder="helper"
        onChange={(e) => setVal(e.target.value)}
      />
      <input id="target" placeholder="target" />
      <br />
      <button id="new_helper">New Helper</button>
      <input id="new_target" placeholder="new target" />
      <br />
      <button id="hidden_helper">Hidden Helper</button>
      <MobileKeyboardOpener
        helperId="hidden_helper"
        targetId={targetId}
        inputProps={{ id: 'hid' }}
      />
    </>
  );
};

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root') as HTMLElement;
  createRoot(container).render(<App />);
});
