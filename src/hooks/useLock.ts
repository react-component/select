import * as React from 'react';

/**
 * Locker return cached mark.
 * If set to `true`, will return `true` in a short time even if set `false`.
 * If set to `false` and then set to `true`, will change to `true`.
 * And after time duration, it will back to `null` automatically.
 */
export function useLock(duration: number = 250): [boolean, (lock: boolean) => void] {
  const [lock, setLock] = React.useState<boolean>(null);
  const lockRef = React.useRef<number>(null);

  // Clean up
  React.useEffect(
    () => () => {
      window.clearTimeout(lockRef.current);
    },
    [],
  );

  function doLock(locked: boolean) {
    if (locked || lock === null) {
      setLock(locked);
    }

    window.clearTimeout(lockRef.current);
    lockRef.current = window.setTimeout(() => {
      setLock(null);
    }, duration);
  }

  return [lock, doLock];
}
