import { useControlledState, useEvent } from '@rc-component/util';
import { useRef, useState, useEffect } from 'react';

const internalMacroTask = (fn: VoidFunction) => {
  const channel = new MessageChannel();
  channel.port1.onmessage = fn;
  channel.port2.postMessage(null);
};

export const macroTask = (fn: VoidFunction, times = 1) => {
  if (times <= 0) {
    fn();
    return;
  }

  internalMacroTask(() => {
    macroTask(fn, times - 1);
  });
};

/**
 * Trigger by latest open call, if nextOpen is undefined, means toggle.
 * `weak` means this call can be ignored if previous call exists.
 */
export type TriggerOpenType = (
  nextOpen?: boolean,
  config?: {
    weak?: boolean;
  },
) => void;

/**
 * When `open` is controlled, follow the controlled value;
 * Otherwise use uncontrolled logic.
 * Setting `open` takes effect immediately,
 * but setting it to `false` is delayed via MessageChannel.
 *
 * SSR handling: During SSR, `open` is always false to avoid Portal issues.
 * On client-side hydration, it syncs with the actual open state.
 */
export default function useOpen(
  propOpen: boolean,
  onOpen: (nextOpen: boolean) => void,
  postOpen: (nextOpen: boolean) => boolean,
): [boolean, TriggerOpenType] {
  // SSR not support Portal which means we need delay `open` for the first time render
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    setRendered(true);
  }, []);

  const [stateOpen, internalSetOpen] = useControlledState(false, propOpen);

  // During SSR, always return false for open state
  const ssrSafeOpen = rendered ? stateOpen : false;
  const mergedOpen = postOpen(ssrSafeOpen);

  const taskIdRef = useRef(0);
  const weakLockRef = useRef(false);

  const triggerEvent = useEvent((nextOpen: boolean) => {
    if (onOpen && mergedOpen !== nextOpen) {
      onOpen(nextOpen);
    }
    internalSetOpen(nextOpen);
  });

  const toggleOpen = useEvent<TriggerOpenType>((nextOpen, config = {}) => {
    const { weak = false } = config;

    taskIdRef.current += 1;
    const id = taskIdRef.current;

    const nextOpenVal = typeof nextOpen === 'boolean' ? nextOpen : !mergedOpen;

    function triggerUpdate() {
      if (
        // Always check if id is match
        id === taskIdRef.current &&
        // Only weak update when not locked
        (!weak || !weakLockRef.current)
      ) {
        triggerEvent(nextOpenVal);
        weakLockRef.current = false;
      }
    }

    // Since `mergedOpen` is post-processed, we need to check if the value really changed
    if (!weak) {
      weakLockRef.current = true;
    }

    // Weak update can be ignored
    if (nextOpenVal) {
      triggerUpdate();
    } else {
      macroTask(() => {
        triggerUpdate();
      });
    }
  });

  return [mergedOpen, toggleOpen] as const;
}
