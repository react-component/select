import React from 'React';

// /**
//  * Wrap `React.useLayoutEffect` which will not throw warning message in test env
//  */
// export default function useLayoutEffect(effect: React.EffectCallback, deps?: React.DependencyList) {
//   // if (typeof window !== 'undefined' && window.document && window.document.documentElement) {
//     React.useLayoutEffect(effect, deps);
//   // }
// }

export default React.useLayoutEffect;