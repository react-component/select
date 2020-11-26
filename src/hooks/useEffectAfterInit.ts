import { useEffect, useRef } from 'react';

// Works the same as React.useEffect but skips the first render
export default (fn, dependencies = []) => {
  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return undefined;
    }
    return fn();
  }, dependencies);
};
