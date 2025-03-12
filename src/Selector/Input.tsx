import * as React from 'react';
import classNames from 'classnames';
import { composeRef } from '@rc-component/util/lib/ref';
import { warning } from '@rc-component/util/lib/warning';
import SelectContext from '../SelectContext';
type InputRef = HTMLInputElement | HTMLTextAreaElement;

interface InputProps {
  prefixCls: string;
  id: string;
  inputElement: React.ReactElement;
  disabled: boolean;
  autoFocus: boolean;
  autoComplete: string;
  editable: boolean;
  activeDescendantId?: string;
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
  onBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLElement>;
  onCompositionStart: React.CompositionEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLElement
  >;
  onCompositionEnd: React.CompositionEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLElement
  >;
}

const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = (props, ref) => {
  const {
    prefixCls,
    id,
    inputElement,
    disabled,
    tabIndex,
    autoFocus,
    autoComplete,
    editable,
    activeDescendantId,
    value,
    maxLength,
    onKeyDown,
    onMouseDown,
    onChange,
    onPaste,
    onCompositionStart,
    onCompositionEnd,
    onBlur,
    open,
    attrs,
  } = props;
  const { classNames: contextClassNames, styles: contextStyles } =
    React.useContext(SelectContext) || {};

  let inputNode: React.ComponentElement<any, any> = inputElement || <input />;

  const { ref: originRef, props: originProps } = inputNode;

  const {
    onKeyDown: onOriginKeyDown,
    onChange: onOriginChange,
    onMouseDown: onOriginMouseDown,
    onCompositionStart: onOriginCompositionStart,
    onCompositionEnd: onOriginCompositionEnd,
    onBlur: onOriginBlur,
    style,
  } = originProps;

  warning(
    !('maxLength' in inputNode.props),
    `Passing 'maxLength' to input element directly may not work because input in BaseSelect is controlled.`,
  );

  inputNode = React.cloneElement(inputNode, {
    type: 'search',
    ...originProps,
    // Override over origin props
    id,
    ref: composeRef(ref, originRef as any),
    disabled,
    tabIndex,
    autoComplete: autoComplete || 'off',

    autoFocus,
    className: classNames(
      `${prefixCls}-selection-search-input`,
      inputNode?.props?.className,
      contextClassNames?.input,
    ),

    role: 'combobox',
    'aria-expanded': open || false,
    'aria-haspopup': 'listbox',
    'aria-owns': `${id}_list`,
    'aria-autocomplete': 'list',
    'aria-controls': `${id}_list`,
    'aria-activedescendant': open ? activeDescendantId : undefined,
    ...attrs,
    value: editable ? value : '',
    maxLength,
    readOnly: !editable,
    unselectable: !editable ? 'on' : null,

    style: { ...style, opacity: editable ? null : 0, ...contextStyles?.input },

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
    onBlur(event: React.FocusEvent<HTMLElement>) {
      onBlur(event);
      if (onOriginBlur) {
        onOriginBlur(event);
      }
    },
  });

  return inputNode;
};

const RefInput = React.forwardRef<InputRef, InputProps>(Input);

if (process.env.NODE_ENV !== 'production') {
  RefInput.displayName = 'Input';
}

export default RefInput;
