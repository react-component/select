import { useControlledState, useEvent } from '@rc-component/util';
import { useRef } from 'react';

const internalMacroTask = (fn: VoidFunction) => {
  const channel = new MessageChannel();
  channel.port1.onmessage = fn;
  channel.port2.postMessage(null);
};

const macroTask = (fn: VoidFunction, times = 1) => {
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
 * ignoreNext will skip next call in the macro task queue.
 */
export type TriggerOpenType = (nextOpen?: boolean, ignoreNext?: boolean) => void;

/**
 * When `open` is controlled, follow the controlled value;
 * Otherwise use uncontrolled logic.
 * Setting `open` takes effect immediately,
 * but setting it to `false` is delayed via MessageChannel.
 */
export default function useOpen(
  propOpen: boolean,
  onOpen: (nextOpen: boolean) => void,
  postOpen: (nextOpen: boolean) => boolean,
): [boolean, TriggerOpenType] {
  const [stateOpen, internalSetOpen] = useControlledState(false, propOpen);
  const mergedOpen = postOpen(stateOpen);

  const taskIdRef = useRef(0);
  const taskLockRef = useRef(false);

  const triggerEvent = useEvent((nextOpen: boolean) => {
    if (onOpen && mergedOpen !== nextOpen) {
      onOpen(nextOpen);
    }
    internalSetOpen(nextOpen);
  });

  const toggleOpen = useEvent<TriggerOpenType>((nextOpen?: boolean, ignoreNext = false) => {
    taskIdRef.current += 1;
    const id = taskIdRef.current;

    const nextOpenVal = typeof nextOpen === 'boolean' ? nextOpen : !mergedOpen;

    // Since `mergedOpen` is post-processed, we need to check if the value really changed
    if (nextOpenVal) {
      triggerEvent(true);

      // Lock if needed
      if (ignoreNext) {
        taskLockRef.current = ignoreNext;

        macroTask(() => {
          taskLockRef.current = false;
        }, 2);
      }
      return;
    }

    macroTask(() => {
      if (id === taskIdRef.current && !taskLockRef.current) {
        triggerEvent(false);
      }
    });
  });

  return [mergedOpen, toggleOpen] as const;
}
