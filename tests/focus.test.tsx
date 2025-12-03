import React, { useState, act } from 'react';
import Select from '../src';
import { fireEvent, render } from '@testing-library/react';

describe('Select.Focus', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('disabled should reset focused', () => {
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
  });

  it('after onBlur is triggered the focused does not need to be reset', () => {
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
  });

  it('when popupRender has custom input, focus it and trigger SelectInput blur should not close the popup', () => {
    const onPopupVisibleChange = jest.fn();

    const { container } = render(
      <Select
        open
        onPopupVisibleChange={onPopupVisibleChange}
        popupRender={() => (
          <div className="bamboo">
            <input className="custom-input" />
          </div>
        )}
      />,
    );

    const selectInput = container.querySelector('input.rc-select-input') as HTMLElement;
    const customInput = container.querySelector('.custom-input') as HTMLElement;

    fireEvent.focus(selectInput);
    selectInput.focus();
    fireEvent.blur(selectInput);

    // Focus custom input should not close popup
    fireEvent.focus(customInput);
    selectInput.focus();

    act(() => {
      jest.runAllTimers();
    });

    expect(onPopupVisibleChange).not.toHaveBeenCalled();

    // Click on the popup element will blur to document but should not close
    fireEvent.mouseDown(container.querySelector('.bamboo'));
    fireEvent.blur(customInput);
    document.body.focus();

    act(() => {
      jest.runAllTimers();
    });

    expect(onPopupVisibleChange).not.toHaveBeenCalled();

    // Click on the body should close the popup
    fireEvent.mouseDown(document.body);
    act(() => {
      jest.runAllTimers();
    });

    expect(onPopupVisibleChange).toHaveBeenCalledWith(false);
  });
});
