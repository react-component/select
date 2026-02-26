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
});
