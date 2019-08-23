/**
 * Cursor rule:
 * 1. Only `showSearch` enabled
 * 2. Only `open` is `true`
 * 3. When typing, set `open` to `true` which hit rule of 2
 *
 * Accessibility:
 * - https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html
 */

import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import TransBtn from './TransBtn';
import { SelectContext } from './Context';
import { LabelValueType, RawValueType } from './interface/generator';
import { RenderNode, Mode } from './interface';

const REST_TAG_KEY = '__RC_SELECT_MAX_REST_COUNT__';

export interface RefSelectorProps {
  focus: () => void;
  blur: () => void;
}

export interface SelectorProps {
  id: string;
  showSearch?: boolean;
  open: boolean;
  /** Display in the Selector value, it's not same as `value` prop */
  values: LabelValueType[];
  multiple: boolean;
  mode: Mode;
  searchValue: string;
  activeValue: string;
  getInputElement?: () => JSX.Element;

  autoFocus?: boolean;
  accessibilityIndex: number;
  disabled?: boolean;
  placeholder?: React.ReactNode;
  removeIcon?: RenderNode;

  // Tags
  maxTagCount?: number;
  maxTagTextLength?: number;
  maxTagPlaceholder?: RenderNode;
  tokenSeparators?: string[];

  onToggleOpen: (open?: boolean) => void;
  onSearch: (searchValue: string) => void;
  onSelect: (value: RawValueType, option: { selected: boolean }) => void;
  onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

const Selector: React.RefForwardingComponent<RefSelectorProps, SelectorProps> = (props, ref) => {
  const { prefixCls } = React.useContext(SelectContext);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);

  const {
    id,
    autoFocus,
    showSearch,
    open,
    values,
    mode,
    multiple,
    searchValue,
    activeValue,
    accessibilityIndex,
    disabled,
    placeholder,
    removeIcon,
    getInputElement,

    maxTagCount,
    maxTagTextLength,
    maxTagPlaceholder = (omittedValues: LabelValueType[]) => `+ ${omittedValues.length} ...`,
    tokenSeparators,

    onToggleOpen,
    onSearch,
    onSelect,
    onInputKeyDown,
  } = props;

  const [inputWidth, setInputWidth] = React.useState(0);

  // ======================= Ref =======================
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    blur: () => {
      inputRef.current.blur();
    },
  }));

  // ===================== Search ======================
  const inputEditable: boolean =
    open &&
    (showSearch ||
      mode === 'combobox' ||
      mode === 'tags' ||
      (mode === 'multiple' && tokenSeparators && !!tokenSeparators.length));

  const onInternalInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    const { which } = event;

    if (which === KeyCode.UP || which === KeyCode.DOWN) {
      event.preventDefault();
    }

    onToggleOpen(true);

    if (onInputKeyDown) {
      onInputKeyDown(event);
    }
  };

  const onInputChange = ({ target: { value } }) => {
    onSearch(value);
    onToggleOpen(true);
  };

  // We measure width and set to the input immediately
  React.useLayoutEffect(() => {
    if (multiple) {
      setInputWidth(measureRef.current.scrollWidth);
    }
  }, [searchValue]);

  // ====================== Focus ======================
  // Should focus input if click the selector
  const onClick = ({ target }) => {
    if (target !== inputRef.current) {
      inputRef.current.focus();
    }
  };

  const onMouseDown: React.MouseEventHandler<HTMLElement> = event => {
    if (event.target !== inputRef.current) {
      event.preventDefault();
    }

    onToggleOpen();
  };

  // ====================== Input ======================
  const inputNode = (getInputElement && getInputElement()) || <input />;

  // ==================== Selection ====================
  let selectionNode: React.ReactNode;
  if (multiple) {
    let displayValues: LabelValueType[] = values;

    // Filter display selection
    if (typeof maxTagCount === 'number') {
      const restCount = values.length - maxTagCount;

      displayValues = values.slice(0, maxTagCount);
      if (typeof maxTagTextLength === 'number') {
        displayValues = displayValues.map(({ label, ...rest }) => {
          let displayLabel: React.ReactNode = label;

          if (typeof label === 'string' || typeof label === 'number') {
            const strLabel = String(displayLabel);

            if (strLabel.length > maxTagTextLength) {
              displayLabel = `${strLabel.slice(0, maxTagTextLength)}...`;
            }
          }

          return {
            ...rest,
            label: displayLabel,
          };
        });
      }

      if (restCount) {
        displayValues.push({
          key: REST_TAG_KEY,
          label:
            typeof maxTagPlaceholder === 'function'
              ? maxTagPlaceholder(values.slice(maxTagCount))
              : maxTagPlaceholder,
        });
      }
    }

    selectionNode = displayValues.map(({ label, value, key }) => (
      <span key={key || value} className={`${prefixCls}-selection-item`}>
        {label}
        {key !== REST_TAG_KEY && (
          <TransBtn
            className={`${prefixCls}-selection-item-remove`}
            onMouseDown={event => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={event => {
              event.stopPropagation();
              onSelect(value, { selected: false });
            }}
            customizeIcon={removeIcon}
          >
            ×
          </TransBtn>
        )}
      </span>
    ));
  } else if (!searchValue) {
    selectionNode = (
      <span className={`${prefixCls}-selection-item`} style={{ opacity: open ? 0.4 : null }}>
        {values.length ? values[0].label : null}
      </span>
    );
  }

  return (
    <div className={`${prefixCls}-selector`} onClick={onClick} onMouseDown={onMouseDown}>
      {selectionNode}

      <span
        className={`${prefixCls}-selection-search`}
        style={{ width: multiple ? inputWidth : null }}
      >
        <input
          ref={inputRef}
          disabled={disabled}
          autoComplete="off"
          autoFocus={autoFocus}
          className={`${prefixCls}-selection-search-input`}
          style={{ opacity: inputEditable ? null : 0 }}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-owns={`${id}_list`}
          aria-autocomplete="list"
          aria-controls={`${id}_list`}
          aria-activedescendant={`${id}_list_${accessibilityIndex}`}
          value={inputEditable ? activeValue || searchValue : ''}
          onKeyDown={onInternalInputKeyDown}
          onChange={onInputChange}
        />

        {multiple && (
          <span ref={measureRef} className={`${prefixCls}-selection-search-mirror`} aria-hidden>
            {searchValue}&nbsp;
          </span>
        )}
      </span>

      {!values.length && !searchValue && (
        <span className={`${prefixCls}-selection-placeholder`}>{placeholder}</span>
      )}
    </div>
  );
};

export default React.forwardRef<RefSelectorProps, SelectorProps>(Selector);
