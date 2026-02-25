import * as React from 'react';
import Affix from './Affix';
import SelectContent from './Content';
import SelectInputContext from './context';
import type { DisplayValueType, Mode, RenderNode } from '../interface';
import useBaseProps from '../hooks/useBaseProps';
import { omit, useEvent } from '@rc-component/util';
import KeyCode from '@rc-component/util/lib/KeyCode';
import { isValidateOpenKey } from '../utils/keyUtil';
import { clsx } from 'clsx';
import type { ComponentsConfig } from '../hooks/useComponents';
import { getDOM } from '@rc-component/util/lib/Dom/findDOMNode';
import { composeRef } from '@rc-component/util/lib/ref';
import pickAttrs from '@rc-component/util/lib/pickAttrs';

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
  removeIcon?: RenderNode;
  multiple?: boolean;
  displayValues: DisplayValueType[];
  placeholder?: React.ReactNode;
  searchValue?: string;
  activeValue?: string;
  mode?: Mode;
  autoClearSearchValue?: boolean;
  onSearch?: (searchText: string, fromTyping: boolean, isCompositing: boolean) => void;
  onSearchSubmit?: (searchText: string) => void;
  onInputBlur?: () => void;
  onClearMouseDown?: React.MouseEventHandler<HTMLElement>;
  onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onSelectorRemove?: (value: DisplayValueType) => void;
  maxLength?: number;
  autoFocus?: boolean;
  /** Check if `tokenSeparators` contains `\n` or `\r\n` */
  tokenWithEnter?: boolean;
  // Add other props that need to be passed through
  className?: string;
  style?: React.CSSProperties;
  focused?: boolean;
  components: ComponentsConfig;
  children?: React.ReactElement;
}

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
  'activeValue',
  'onSelectorRemove',
  'focused',
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
    children,

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
    onClearMouseDown,
    onInputKeyDown,
    onSelectorRemove,

    // Token handling
    tokenWithEnter,

    // Components
    components,

    ...restProps
  } = props;

  const { triggerOpen, toggleOpen, showSearch, disabled, loading, classNames, styles } =
    useBaseProps();

  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Handle keyboard events similar to original Selector
  const onInternalInputKeyDown = useEvent(
    (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { which } = event;

      // Compatible with multiple lines in TextArea
      const isTextAreaElement = inputRef.current instanceof HTMLTextAreaElement;

      // Prevent default behavior for up/down arrows when dropdown is open
      if (!isTextAreaElement && triggerOpen && (which === KeyCode.UP || which === KeyCode.DOWN)) {
        event.preventDefault();
      }

      // Call the original onInputKeyDown callback
      if (onInputKeyDown) {
        onInputKeyDown(event);
      }

      // Move within the text box for TextArea
      if (
        isTextAreaElement &&
        !triggerOpen &&
        ~[KeyCode.UP, KeyCode.DOWN, KeyCode.LEFT, KeyCode.RIGHT].indexOf(which)
      ) {
        return;
      }

      // Open dropdown when a valid open key is pressed
      const isModifier = event.ctrlKey || event.altKey || event.metaKey;
      if (!isModifier && isValidateOpenKey(which)) {
        toggleOpen(true);
      }
    },
  );

  // ====================== Refs ======================
  React.useImperativeHandle(ref, () => {
    return {
      focus: (options?: FocusOptions) => {
        // Focus the inner input if available, otherwise fall back to root div.
        (inputRef.current || rootRef.current).focus?.(options);
      },
      blur: () => {
        (inputRef.current || rootRef.current).blur?.();
      },
      nativeElement: rootRef.current,
    };
  });

  // ====================== Open ======================
  const onInternalMouseDown: SelectInputProps['onMouseDown'] = useEvent((event) => {
    if (!disabled) {
      const inputDOM = getDOM(inputRef.current);

      // https://github.com/ant-design/ant-design/issues/56002
      // Tell `useSelectTriggerControl` to ignore this event
      // When icon is dynamic render, the parentNode will miss
      // so we need to mark the event directly
      (event.nativeEvent as any)._ori_target = inputDOM;

      const isClickOnInput = inputDOM === event.target || inputDOM?.contains(event.target as Node);

      if (inputDOM && !isClickOnInput) {
        event.preventDefault();
      }

      // Check if we should prevent closing when clicking on selector
      // Don't close if: open && not multiple && (combobox mode || showSearch)
      const shouldPreventCloseOnSingle =
        triggerOpen && !multiple && (mode === 'combobox' || showSearch);

      // Don't close if: open && multiple && click on input
      const shouldPreventCloseOnMultipleInput = triggerOpen && multiple && isClickOnInput;

      const shouldPreventClose = shouldPreventCloseOnSingle || shouldPreventCloseOnMultipleInput;

      if (!(event.nativeEvent as any)._select_lazy) {
        inputRef.current?.focus();

        // Only toggle open if we should not prevent close
        if (!shouldPreventClose) {
          toggleOpen();
        }
      } else if (triggerOpen) {
        // Lazy should also close when click clear icon
        toggleOpen(false);
      }
    }

    onMouseDown?.(event);
  });

  // =================== Components ===================
  const { root: RootComponent } = components;

  // ===================== Render =====================
  const domProps = omit(restProps, DEFAULT_OMIT_PROPS as any);
  const ariaProps = pickAttrs(domProps, { aria: true });
  const ariaKeys = Object.keys(ariaProps) as (keyof typeof domProps)[];

  // Create context value with wrapped callbacks
  const contextValue = {
    ...props,
    onInputKeyDown: onInternalInputKeyDown,
  };

  if (RootComponent) {
    if (React.isValidElement<any>(RootComponent)) {
      return React.cloneElement(RootComponent, {
        ...domProps,
        ref: composeRef((RootComponent as any).ref, rootRef),
      });
    }

    return <RootComponent {...domProps} ref={rootRef} />;
  }

  return (
    <SelectInputContext.Provider value={contextValue}>
      <div
        {...omit(domProps, ariaKeys)}
        // Style
        ref={rootRef}
        className={className}
        style={style}
        // Mouse Events
        onMouseDown={onInternalMouseDown}
      >
        {/* Prefix */}
        <Affix className={clsx(`${prefixCls}-prefix`, classNames?.prefix)} style={styles?.prefix}>
          {prefix}
        </Affix>

        {/* Content */}
        <SelectContent ref={inputRef} />

        {/* Suffix */}
        <Affix
          className={clsx(
            `${prefixCls}-suffix`,
            {
              [`${prefixCls}-suffix-loading`]: loading,
            },
            classNames?.suffix,
          )}
          style={styles?.suffix}
        >
          {suffix}
        </Affix>
        {/* Clear Icon */}
        {clearIcon && (
          <Affix
            className={clsx(`${prefixCls}-clear`, classNames?.clear)}
            style={styles?.clear}
            onMouseDown={(e) => {
              // Mark to tell not trigger open or focus
              (e.nativeEvent as any)._select_lazy = true;
              onClearMouseDown?.(e);
            }}
          >
            {clearIcon}
          </Affix>
        )}
        {children}
      </div>
    </SelectInputContext.Provider>
  );
});
