import { useControlledState, useEvent } from '@rc-component/util';
import { useRef } from 'react';

const macroTask = (fn: VoidFunction) => {
  const channel = new MessageChannel();
  channel.port1.onmessage = fn;
  channel.port2.postMessage(null);
};

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
) {
  const [stateOpen, internalSetOpen] = useControlledState(false, propOpen);
  const mergedOpen = postOpen(stateOpen);

  const taskIdRef = useRef(0);

  const triggerEvent = useEvent((nextOpen: boolean) => {
    if (onOpen && mergedOpen !== nextOpen) {
      onOpen(nextOpen);
    }
    internalSetOpen(nextOpen);
  });

  const toggleOpen = useEvent((nextOpen?: boolean) => {
    taskIdRef.current += 1;
    const id = taskIdRef.current;

    const nextOpenVal = typeof nextOpen === 'boolean' ? nextOpen : !mergedOpen;

    if (nextOpenVal === mergedOpen) {
      return;
    }

    console.error('toggleOpen', nextOpenVal);

    if (nextOpenVal) {
      triggerEvent(true);
      return;
    }

    macroTask(() => {
      if (id === taskIdRef.current) {
        triggerEvent(false);
      }
    });
  });

  return [mergedOpen, toggleOpen] as const;
}
