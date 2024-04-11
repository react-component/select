import * as React from 'react';
import Select from '../src';
import { injectRunAllTimers } from './utils/common';
import { fireEvent, render } from '@testing-library/react';

describe('Select.Custom', () => {
  injectRunAllTimers(jest);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('getRawInputElement', () => {
    const onDropdownVisibleChange = jest.fn();
    const { container } = render(
      <Select
        getRawInputElement={() => <span className="custom" />}
        onDropdownVisibleChange={onDropdownVisibleChange}
      />,
    );
    fireEvent.click(container.querySelector('.custom'));

    expect(onDropdownVisibleChange).toHaveBeenCalledWith(true);
  });
});
