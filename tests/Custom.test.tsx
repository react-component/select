import { mount } from 'enzyme';
import * as React from 'react';
import Select from '../src';
import { injectRunAllTimers } from './utils/common';

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
    const wrapper = mount(
      <Select
        getRawInputElement={() => <span className="custom" />}
        onDropdownVisibleChange={onDropdownVisibleChange}
      />,
    );
    wrapper.find('.custom').simulate('click');

    expect(onDropdownVisibleChange).toHaveBeenCalledWith(true);
  });
});
