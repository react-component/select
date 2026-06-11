import * as React from 'react';
import Select from '../src';
import { injectRunAllTimers, waitFakeTimer } from './utils/common';
import { fireEvent, render } from '@testing-library/react';

describe('Select.Custom', () => {
  injectRunAllTimers(jest);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('getRawInputElement', async () => {
    const onPopupVisibleChange = jest.fn();
    const { container } = render(
      <Select
        getRawInputElement={() => <span className="custom" />}
        onPopupVisibleChange={onPopupVisibleChange}
      />,
    );
    fireEvent.click(container.querySelector('.custom'));
    await waitFakeTimer();

    expect(onPopupVisibleChange).toHaveBeenCalledWith(true);
  });

  it('should not override raw input element event handlers', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();

    const { getByPlaceholderText } = render(
      <Select
        showSearch
        options={[{ value: 'a', label: 'A' }]}
        getRawInputElement={() => (
          <input placeholder="focus me" onFocus={onFocus} onBlur={onBlur} />
        )}
      />,
    );

    fireEvent.focus(getByPlaceholderText('focus me'));
    fireEvent.blur(getByPlaceholderText('focus me'));

    expect(onFocus).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
  });

  it('should handle nested nativeElement structure correctly', () => {
    // Mock component that returns nativeElement structure (similar to antd Input)
    const CustomInputWithNativeElement = React.forwardRef<
      { nativeElement: HTMLInputElement },
      React.InputHTMLAttributes<HTMLInputElement>
    >((props, ref) => {
      const inputRef = React.useRef<HTMLInputElement>(null);

      React.useImperativeHandle(ref, () => ({
        nativeElement: inputRef.current!,
        focus: () => inputRef.current?.focus(),
        blur: () => inputRef.current?.blur(),
      }));

      return <input ref={inputRef} {...props} />;
    });

    const selectRef = React.createRef<any>();

    render(
      <Select
        ref={selectRef}
        getRawInputElement={() => <CustomInputWithNativeElement className="custom-input" />}
      />,
    );

    // The nativeElement should be a DOM element, not a nested object
    const { nativeElement } = selectRef.current;
    expect(nativeElement).toBeInstanceOf(HTMLInputElement);
    expect(nativeElement.className).toBe('custom-input');
  });
});
