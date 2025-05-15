import * as React from 'react';
import classNames from 'classnames';
import { composeRef } from 'rc-util/lib/ref';
import { warning } from 'rc-util/lib/warning';
import composeProps from 'rc-util/lib/composeProps';

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
    autoFocus,
    autoComplete,
    editable,
    activeDescendantId,
    value,
    open,
    attrs,
    ...restProps
  } = props;

  let inputNode: React.ComponentElement<any, any> = inputElement || <input />;

  const { ref: originRef, props: originProps } = inputNode;

  warning(
    !('maxLength' in inputNode.props),
    `Passing 'maxLength' to input element directly may not work because input in BaseSelect is controlled.`,
  );

  inputNode = React.cloneElement(inputNode, {
    type: 'search',
    ...composeProps(restProps, originProps, true),

    // Override over origin props
    id,
    ref: composeRef(ref, originRef as any),
    autoComplete: autoComplete || 'off',

    autoFocus,
    className: classNames(`${prefixCls}-selection-search-input`, originProps?.className),

    role: 'combobox',
    'aria-expanded': open || false,
    'aria-haspopup': 'listbox',
    'aria-owns': `${id}_list`,
    'aria-autocomplete': 'list',
    'aria-controls': `${id}_list`,
    'aria-activedescendant': open ? activeDescendantId : undefined,
    ...attrs,
    value: editable ? value : '',
    readOnly: !editable,
    unselectable: !editable ? 'on' : null,

    style: { ...originProps.style, opacity: editable ? null : 0 },
  });

  return inputNode;
};

const RefInput = React.forwardRef<InputRef, InputProps>(Input);

if (process.env.NODE_ENV !== 'production') {
  RefInput.displayName = 'Input';
}

export default RefInput;
