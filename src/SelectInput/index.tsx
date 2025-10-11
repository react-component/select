import * as React from 'react';
import clsx from 'clsx';
import Affix from './Affix';
import SelectContent from './Content';
import SelectInputContext from './context';
import type { DisplayValueType, Mode } from '../interface';

export interface SelectInputRef {
  focus: (options?: FocusOptions) => void;
  blur: () => void;
  nativeElement: HTMLDivElement;
}

export interface SelectInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix'> {
  prefixCls: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  clearIcon?: React.ReactNode;
  multiple?: boolean;
  displayValues: DisplayValueType[];
  placeholder?: React.ReactNode;
  searchValue?: string;
  mode?: Mode;
  onSearch?: (searchText: string, fromTyping: boolean, isCompositing: boolean) => void;
  onSearchSubmit?: (searchText: string) => void;
  onInputBlur?: () => void;
  onClearMouseDown?: React.MouseEventHandler<HTMLElement>;
  onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  maxLength?: number;
  autoFocus?: boolean;
  // Add other props that need to be passed through
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}
import useBaseProps from '../hooks/useBaseProps';
import { omit, useEvent } from '@rc-component/util';

const DEFAULT_OMIT_PROPS = [
  'value',
  'onChange',
  'removeIcon',
  'placeholder',
  'maxTagCount',
  'maxTagTextLength',
  'maxTagPlaceholder',
  'choiceTransitionName',
  'onInputKeyDown',
  'onPopupScroll',
  'tabIndex',
] as const;

export default React.forwardRef<SelectInputRef, SelectInputProps>(function SelectInput(
  props: SelectInputProps,
  ref: React.ForwardedRef<SelectInputRef>,
) {
  const {
    // Style
    prefixCls,
    className,
    style,

    // UI
    prefix,
    suffix,
    clearIcon,

    // Data
    multiple,
    displayValues,
    placeholder,
    mode,

    // Search
    searchValue,
    onSearch,
    onSearchSubmit,
    onInputBlur,

    // Input
    maxLength,
    autoFocus,

    // Events
    onMouseDown,
    onBlur,
    onClearMouseDown,
    onInputKeyDown,

    ...restProps
  } = props;

  const { triggerOpen, toggleOpen } = useBaseProps();

  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Wrap onSearch to trigger dropdown open when typing
  const onInternalSearch = useEvent(
    (searchText: string, fromTyping: boolean, isCompositing: boolean) => {
      // Open dropdown when user is typing and not compositing
      if (fromTyping && !isCompositing && !triggerOpen) {
        toggleOpen(true);
      }

      onSearch?.(searchText, fromTyping, isCompositing);
    },
  );

  // ====================== Refs ======================
  React.useImperativeHandle(
    ref,
    () => ({
      focus: (options?: FocusOptions) => {
        // Focus the inner input if available, otherwise fall back to root div.
        inputRef.current.focus?.(options);
      },
      blur: () => {
        inputRef.current.blur?.();
      },
      nativeElement: rootRef.current,
    }),
    [],
  );

  // ====================== Open ======================
  const onInternalMouseDown: SelectInputProps['onMouseDown'] = useEvent((event) => {
    event.preventDefault();

    if (!(event.nativeEvent as any)._select_lazy) {
      inputRef.current?.focus();
      toggleOpen();
    } else if (triggerOpen) {
      // Lazy should also close when click clear icon
      toggleOpen(false);
    }

    onMouseDown?.(event);
  });

  const onInternalBlur: SelectInputProps['onBlur'] = (event) => {
    toggleOpen(false);
    onBlur?.(event);
  };

  // ===================== Render =====================
  const domProps = omit(restProps, DEFAULT_OMIT_PROPS);

  // Create context value with wrapped onSearch
  const contextValue = {
    ...props,
    onSearch: onInternalSearch,
  };

  return (
    <SelectInputContext.Provider value={contextValue}>
      <div
        {...domProps}
        // Style
        ref={rootRef}
        className={clsx(className)}
        style={style}
        // Open
        onMouseDown={onInternalMouseDown}
        onBlur={onInternalBlur}
      >
        {/* Prefix */}
        <Affix type="prefix">{prefix}</Affix>

        {/* Content */}
        <SelectContent ref={inputRef} />

        {/* Suffix */}
        <Affix type="suffix">{suffix}</Affix>
        {/* Clear Icon */}
        {clearIcon && (
          <Affix
            type="clear"
            onMouseDown={(e) => {
              // Mark to tell not trigger open or focus
              (e.nativeEvent as any)._select_lazy = true;
              onClearMouseDown?.(e);
            }}
          >
            {clearIcon}
          </Affix>
        )}
      </div>
    </SelectInputContext.Provider>
  );
});
