import * as React from 'react';

const isClient =
  process.env.NODE_ENV !== 'test' &&
  typeof window !== 'undefined' &&
  window.document &&
  window.document.documentElement;

/**
 * Wrap `React.useLayoutEffect` which will not throw warning message in test env
 */
export default function useLayoutEffect(effect: React.EffectCallback, deps?: React.DependencyList) {
  if (isClient) {
    React.useLayoutEffect(effect, deps);
  } else {
    React.useEffect(effect, deps);
  }
}
