import React, { useState, act } from 'react';
import Select from '../src';
import { fireEvent, render } from '@testing-library/react';

describe('Select.Focus', () => {
  it('disabled should reset focused', () => {
    jest.clearAllTimers();
    jest.useFakeTimers();

    jest.clearAllTimers();

    const { container, rerender } = render(<Select />);

    // Focus
    fireEvent.focus(container.querySelector('input'));
    act(() => {
      jest.runAllTimers();
    });
    expect(container.querySelector('.rc-select-focused')).toBeTruthy();

    // Disabled
    rerender(<Select disabled />);
    act(() => {
      jest.runAllTimers();
    });
    expect(container.querySelector('.rc-select-focused')).toBeFalsy();

    jest.useRealTimers();
  });

  it('after onBlur is triggered the focused does not need to be reset', () => {
    jest.useFakeTimers();

    const onFocus = jest.fn();

    const Demo: React.FC = () => {
      const [disabled, setDisabled] = useState(false);
      return (
        <>
          <Select disabled={disabled} onFocus={onFocus} onBlur={() => setDisabled(true)} />
          <button onClick={() => setDisabled(false)} />
        </>
      );
    };

    const { container } = render(<Demo />);

    fireEvent.focus(container.querySelector('input'));
    jest.runAllTimers();

    // trigger disabled
    fireEvent.blur(container.querySelector('input'));
    jest.runAllTimers();

    // reset focused
    onFocus.mockReset();

    expect(container.querySelector('.rc-select-disabled')).toBeTruthy();

    // reset disabled
    fireEvent.click(container.querySelector('button'));
    fireEvent.focus(container.querySelector('input'));
    jest.runAllTimers();

    expect(onFocus).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('IE focus', () => {
    jest.clearAllTimers();
    jest.useFakeTimers();

    jest.clearAllTimers();

    (document.body.style as any).msTouchAction = true;
    const { container } = render(<Select mode="tags" value="bamboo" />);

    const focusFn = jest.spyOn(container.querySelector('input'), 'focus');

    fireEvent.click(container.querySelector('.rc-select-selector'));
    jest.runAllTimers();

    expect(focusFn).toHaveBeenCalled();

    jest.useRealTimers();
  });
});
