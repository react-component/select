import * as React from 'react';
import type { DisplayValueType } from '.';

export interface PoliteProps {
  visible: boolean;
  values: DisplayValueType[];
}

export default function Polite(props: PoliteProps) {
  const { visible, values } = props;

  if (!visible) {
    return null;
  }

  // Only cut part of values since it's a screen reader
  const MAX_COUNT = 50;

  return (
    <span
      aria-live="polite"
      style={{ width: 0, height: 0, position: 'absolute', overflow: 'hidden', opacity: 0 }}
    >
      {/* Merge into one string to make screen reader work as expect */}
      {`${values
        .slice(0, MAX_COUNT)
        .map(({ label, value }) => (['number', 'string'].includes(typeof label) ? label : value))
        .join(', ')}`}
      {values.length > MAX_COUNT ? ', ...' : null}
    </span>
  );
}
