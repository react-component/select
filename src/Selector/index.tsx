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
import { useRef } from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import MultipleSelector from './MultipleSelector';
import SingleSelector from './SingleSelector';
import { LabelValueType, RawValueType, CustomTagProps } from '../interface/generator';
import { RenderNode, Mode, FlattenOptionData } from '../interface';
import useLock from '../hooks/useLock';
import { handleClickAction } from '../utils/miscUtil';

export interface InnerSelectorProps {
  prefixCls: string;
  id: string;
  mode: Mode;

  inputRef: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
  placeholder?: React.ReactNode;
  disabled?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  displayValues: LabelValueType[];
  showSearch?: boolean;
  searchValue: string;
  accessibilityIndex: number;
  open: boolean;
  tabIndex?: number;

  onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onInputMouseDown: React.MouseEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onInputChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onInputPaste: React.ClipboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onInputCompositionStart: React.CompositionEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onInputCompositionEnd: React.CompositionEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export interface RefSelectorProps {
  focus: () => void;
  blur: () => void;
}

export interface SelectorProps {
  id: string;
  prefixCls: string;
  showSearch?: boolean;
  open: boolean;
  searchValueIsSelectedLabel: boolean;
  multiple: boolean;
  mode: Mode;
  searchValue: string;
  activeValue: string;
  inputElement: JSX.Element;

  autoFocus?: boolean;
  accessibilityIndex: number;
  tabIndex?: number;
  disabled?: boolean;
  placeholder?: React.ReactNode;
  removeIcon?: RenderNode;

  // Tags
  maxTagCount?: number;
  maxTagTextLength?: number;
  maxTagPlaceholder?: React.ReactNode | ((omittedValues: LabelValueType[]) => React.ReactNode);
  tagRender?: (props: CustomTagProps) => React.ReactElement;

  /** Check if `tokenSeparators` contains `\n` or `\r\n` */
  tokenWithEnter?: boolean;

  // Motion
  choiceTransitionName?: string;

  displayValues: FlattenOptionData[];
  requestSetIsDropdownVisible: (open?: boolean) => void;
  /** `onSearch` returns go next step boolean to check if need do toggle open */
  onSearch: (searchText: string, fromTyping: boolean, isCompositing: boolean) => boolean;
  onSearchSubmit: (searchText: string) => void;
  onSelect: (value: RawValueType, option: { selected: boolean }) => void;
  onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onEscapeSearchInput: () => void;
  onFocus: () => void;

  /**
   * @private get real dom for trigger align.
   * This may be removed after React provides replacement of `findDOMNode`
   */
  domRef: React.Ref<HTMLDivElement>;
}

const Selector: React.RefForwardingComponent<RefSelectorProps, SelectorProps> = (props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const compositionStatusRef = useRef<boolean>(false);

  const {
    prefixCls,
    multiple,
    open,
    mode,
    showSearch,
    tokenWithEnter,
    searchValueIsSelectedLabel,

    requestSetIsDropdownVisible,

    onSearch,
    onSearchSubmit,
    onInputKeyDown,
    onEscapeSearchInput,
    onFocus,

    domRef,
  } = props;

  // ======================= Ref =======================
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    blur: () => {
      inputRef.current.blur();
    },
  }));

  // ====================== Input ======================
  const [getInputMouseDown, setInputMouseDown] = useLock(0);

  const onInternalInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    const { which } = event;

    if ([KeyCode.UP, KeyCode.DOWN, KeyCode.ESC].includes(which)) {
      event.preventDefault();
    }

    if (which === KeyCode.ESC && onEscapeSearchInput) {
      onEscapeSearchInput();
    }

    if (onInputKeyDown) {
      onInputKeyDown(event);
    }

    if (which === KeyCode.ENTER && mode === 'tags' && !compositionStatusRef.current && !open) {
      // When menu isn't open, OptionList won't trigger a value change
      // So when enter is pressed, the tag's input value should be emitted here to let selector know
      onSearchSubmit((event.target as HTMLInputElement).value);
    }

    if (![KeyCode.SHIFT, KeyCode.TAB, KeyCode.BACKSPACE, KeyCode.ESC].includes(which)) {
      requestSetIsDropdownVisible(true);
    }
  };

  /**
   * We can not use `findDOMNode` sine it will get warning,
   * have to use timer to check if is input element.
   */
  const onInternalInputMouseDown: React.MouseEventHandler<HTMLInputElement> = () => {
    setInputMouseDown(true);
  };

  // When paste come, ignore next onChange
  const pastedTextRef = useRef<string>(null);

  const onInputCompositionStart = () => {
    compositionStatusRef.current = true;
  };

  const onInputCompositionEnd = () => {
    compositionStatusRef.current = false;
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    let {
      target: { value },
    } = event;

    // Pasted text should replace back to origin content
    if (tokenWithEnter && pastedTextRef.current && /[\r\n]/.test(pastedTextRef.current)) {
      // CRLF will be treated as a single space for input element
      const replacedText = pastedTextRef.current.replace(/\r\n/g, ' ').replace(/[\r\n]/g, ' ');
      value = value.replace(replacedText, pastedTextRef.current);
    }

    pastedTextRef.current = null;

    if (onSearch(value, true, compositionStatusRef.current) !== false) {
      requestSetIsDropdownVisible(true);
    }
  };

  const onInputPaste: React.ClipboardEventHandler = e => {
    const { clipboardData } = e;
    const value = clipboardData.getData('text');

    pastedTextRef.current = value;
  };

  const onClick = ({ target }) => {
    if (target !== inputRef.current) {
      // Should focus input if click the selector
      handleClickAction(
        () => inputRef.current.focus(),
        {
          isIE: (document.body.style as any).msTouchAction !== undefined,
        },
      );
    }
  };

  const onMouseDown: React.MouseEventHandler<HTMLElement> = event => {
    const inputMouseDown = getInputMouseDown();
    if (event.target !== inputRef.current && !inputMouseDown) {
      event.preventDefault();
    }

    if ((mode !== 'combobox' && (!showSearch || !inputMouseDown)) || !open) {
      if (open) {
        onSearch('', true, false);
      }
      requestSetIsDropdownVisible(!open);
    }
  };

  // ================= Inner Selector ==================
  const sharedProps = {
    inputRef,
    onInputKeyDown: onInternalInputKeyDown,
    onInputMouseDown: onInternalInputMouseDown,
    onInputChange,
    onInputPaste,
    onInputCompositionStart,
    onInputCompositionEnd,
  };

  const selectNode = multiple ? (
    <MultipleSelector {...props} {...sharedProps} />
  ) : (
    <SingleSelector
      {...props}
      {...sharedProps}
      searchValueIsSelectedLabel={searchValueIsSelectedLabel}
    />
  );

  return (
    <div
      ref={domRef}
      className={`${prefixCls}-selector`}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onFocus={onFocus}
    >
      {selectNode}
    </div>
  );
};

const ForwardSelector = React.forwardRef<RefSelectorProps, SelectorProps>(Selector);
ForwardSelector.displayName = 'Selector';

export default ForwardSelector;
