import React from 'react';

type InputRef = HTMLInputElement | HTMLTextAreaElement;

interface InputProps {
  prefixCls: string;
  id: string;
  inputElement: React.ReactElement;
  disabled: boolean;
  autoFocus: boolean;
  editable: boolean;
  accessibilityIndex: number;
  value: string;

  onKeyDown: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  {
    prefixCls,
    id,
    inputElement,
    disabled,
    autoFocus,
    editable,
    accessibilityIndex,
    value,
    onKeyDown,
    onChange,
  },
  ref,
) => {
  let inputNode: React.ReactElement = inputElement || <input />;

  inputNode = React.cloneElement(inputNode, {
    ref,
    disabled,
    autoComplete: 'off',
    autoFocus,
    className: `${prefixCls}-selection-search-input`,
    style: { opacity: editable ? null : 0 },
    role: 'combobox',
    'aria-expanded': open,
    'aria-haspopup': 'listbox',
    'aria-owns': `${id}_list`,
    'aria-autocomplete': 'list',
    'aria-controls': `${id}_list`,
    'aria-activedescendant': `${id}_list_${accessibilityIndex}`,
    value: editable ? value : '',
    onKeyDown,
    onChange,
  });

  return inputNode;
};

export default React.forwardRef<InputRef, InputProps>(Input);
