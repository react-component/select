import * as React from 'react';
import { useEvent } from '@rc-component/util';
import type { TriggerOpenType } from './useOpen';

export function isInside(elements: (HTMLElement | SVGElement | undefined)[], target: HTMLElement) {
  return elements
    .filter((element) => element)
    .some((element) => element.contains(target) || element === target);
}

export default function useSelectTriggerControl(
  elements: () => (HTMLElement | SVGElement | undefined)[],
  open: boolean,
  triggerOpen: TriggerOpenType,
  customizedTrigger: boolean,
) {
  const onGlobalMouseDown = useEvent((event: MouseEvent) => {
    // If trigger is customized, Trigger will take control of popupVisible
    if (customizedTrigger) {
      return;
    }

    let target = event.target as HTMLElement;

    if (target.shadowRoot && event.composed) {
      target = (event.composedPath()[0] || target) as HTMLElement;
    }

    if (
      open &&
      // Marked by SelectInput mouseDown event
      !(event as any)._ignore_global_close &&
      !isInside(elements(), target)
    ) {
      // Should trigger close
      triggerOpen(false, {
        weak: true,
      });
    }
  });

  React.useEffect(() => {
    window.addEventListener('mousedown', onGlobalMouseDown);
    return () => window.removeEventListener('mousedown', onGlobalMouseDown);
  }, [onGlobalMouseDown]);
}
