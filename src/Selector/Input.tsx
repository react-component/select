import * as React from 'react';
import classNames from 'classnames';
import { composeRef } from 'rc-util/lib/ref';

type InputRef = HTMLInputElement | HTMLTextAreaElement;

interface InputProps {
  prefixCls: string;
  id: string;
  inputElement: React.ReactElement;
  disabled: boolean;
  autoFocus: boolean;
  autoComplete: string;
  editable: boolean;
  accessibilityIndex: number;
  value: string;
  maxLength?: number;
  open: boolean;
  tabIndex: number;
  /** Pass accessibility props to input */
  attrs: Record<string, unknown>;

  onKeyDown: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLElement>;
  onMouseDown: React.MouseEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLElement>;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLElement>;
  onPaste: React.ClipboardEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLElement>;
  onCompositionStart: React.CompositionEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLElement
  >;
  onCompositionEnd: React.CompositionEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLElement
  >;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  {
    prefixCls,
    id,
    inputElement,
    disabled,
    tabIndex,
    autoFocus,
    autoComplete,
    editable,
    accessibilityIndex,
    value,
    maxLength,
    onKeyDown,
    onMouseDown,
    onChange,
    onPaste,
    onCompositionStart,
    onCompositionEnd,
    open,
    attrs,
  },
  ref,
) => {
  let inputNode: React.ComponentElement<any, any> = inputElement || <input />;

  const {
    ref: originRef,
    props: {
      onKeyDown: onOriginKeyDown,
      onChange: onOriginChange,
      onMouseDown: onOriginMouseDown,
      onCompositionStart: onOriginCompositionStart,
      onCompositionEnd: onOriginCompositionEnd,
      style,
    },
  } = inputNode;

  inputNode = React.cloneElement(inputNode, {
    id,
    ref: composeRef(ref, originRef as any),
    disabled,
    tabIndex,
    autoComplete: autoComplete || 'off',
    type: 'search',
    autoFocus,
    className: classNames(`${prefixCls}-selection-search-input`, inputNode?.props?.className),
    style: { ...style, opacity: editable ? null : 0 },
    role: 'combobox',
    'aria-expanded': open,
    'aria-haspopup': 'listbox',
    'aria-owns': `${id}_list`,
    'aria-autocomplete': 'list',
    'aria-controls': `${id}_list`,
    'aria-activedescendant': `${id}_list_${accessibilityIndex}`,
    ...attrs,
    value: editable ? value : '',
    maxLength,
    readOnly: !editable,
    unselectable: !editable ? 'on' : null,
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown(event);
      if (onOriginKeyDown) {
        onOriginKeyDown(event);
      }
    },
    onMouseDown: (event: React.MouseEvent<HTMLElement>) => {
      onMouseDown(event);
      if (onOriginMouseDown) {
        onOriginMouseDown(event);
      }
    },
    onChange: (event: React.ChangeEvent<HTMLElement>) => {
      onChange(event);
      if (onOriginChange) {
        onOriginChange(event);
      }
    },
    onCompositionStart(event: React.CompositionEvent<HTMLElement>) {
      onCompositionStart(event);
      if (onOriginCompositionStart) {
        onOriginCompositionStart(event);
      }
    },
    onCompositionEnd(event: React.CompositionEvent<HTMLElement>) {
      onCompositionEnd(event);
      if (onOriginCompositionEnd) {
        onOriginCompositionEnd(event);
      }
    },
    onPaste,
  });

  return inputNode;
};

const RefInput = React.forwardRef<InputRef, InputProps>(Input);
RefInput.displayName = 'Input';

export default RefInput;
