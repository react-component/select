import * as React from 'react';

/**
 * Similar with `useLock`, but this hook will always execute last value.
 * When set to `true`, it will keep `true` for a short time even if `false` is set.
 */
export default function useDelayReset(
  timeout: number = 10,
): [boolean, (val: boolean, callback?: () => void) => void, () => void] {
  const [bool, setBool] = React.useState<boolean>(false);
  const delayRef = React.useRef<number>(null);

  const cancelLatest = () => {
    window.clearTimeout(delayRef.current);
  };

  React.useEffect(() => cancelLatest, []);

  const delaySetBool = (value: boolean, callback: () => void) => {
    cancelLatest();

    delayRef.current = window.setTimeout(() => {
      setBool(value);
      if (callback) {
        callback();
      }
    }, timeout);
  };

  return [bool, delaySetBool, cancelLatest];
}
