import * as React from 'react';
import { SelectContext } from './Context';

export interface SelectorProps {
  id: string;
  showSearch?: boolean;
  open: boolean;

  onToggleOpen: (open?: boolean) => void;
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
}

const Selector: React.FC<SelectorProps> = props => {
  const { prefixCls } = React.useContext(SelectContext);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { id, showSearch, open, onToggleOpen, onFocus, onBlur } = props;

  // Should focus input if click the selector
  const onClick = ({ target }) => {
    if (target !== inputRef.current) {
      inputRef.current.focus();
    }
    onToggleOpen();
  };

  return (
    <div className={`${prefixCls}-selector`} onClick={onClick}>
      Selector
      <input
        ref={inputRef}
        onFocus={onFocus}
        onBlur={onBlur}
        readOnly={showSearch}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-owns={`${id}_list`}
      />
    </div>
  );
};

export default Selector;
