import React from 'react';
import warning, { noteOnce } from 'rc-util/lib/warning';
import { OptionsType, Mode } from '../interface';

interface CheckProps {
  mode: Mode;
  options: { disabled?: boolean }[];
  backfill: boolean;
  allowClear: boolean;
  placeholder: React.ReactNode;
  getInputElement: Function;
  showSearch: boolean;
  onSearch: Function;
}

/**
 * Not a real hook, just check for props is validate
 */
export function usePropsWarning({
  mode,
  options,
  backfill,
  allowClear,
  placeholder,
  getInputElement,
  showSearch,
  onSearch,
}: CheckProps) {
  if (process.env.NODE_ENV !== 'production') {
    // `tags` should not set option as disabled
    warning(
      mode !== 'tags' || options.every(opt => !opt.disabled),
      'Please avoid setting option to disabled in tags mode since user can always type text as tag.',
    );

    // Only `combobox` support `backfill`
    warning(mode === 'combobox' || !backfill, '`backfill` only works with `combobox` mode.');

    // Only `combobox` support `getInputElement`
    warning(
      mode === 'combobox' || !getInputElement,
      '`getInputElement` only work with `combobox` mode.',
    );

    // Customize `getInputElement` should not use `allowClear` & `placeholder`
    noteOnce(
      mode !== 'combobox' || !getInputElement || !allowClear || !placeholder,
      'Customize `getInputElement` should customize clear and placeholder logic instead of configuring `allowClear` and `placeholder`.',
    );

    // `onSearch` should use in `combobox` or `showSearch`
    warning(
      onSearch && (mode === 'combobox' || showSearch),
      '`onSearch` should work with `showSearch` instead of use alone.',
    );
  }
}
