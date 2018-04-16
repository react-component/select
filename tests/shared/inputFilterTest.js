/* eslint-disable no-undef */
import React from 'react';
import Select from '../../src/Select';
import Option from '../../src/Option';
import { mount } from 'enzyme';

export default function inputFilterTest(mode) {
  it('should keep input filter after select in and only in multiple mode', () => {
    const wrapper = mount(
      <Select {... { [mode]: true }}>
        <Option value="11">11</Option>
        <Option value="12">12</Option>
        <Option value="22">22</Option>
      </Select>,
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: {
      value: '1',
    } });

    expect(wrapper.state().open).toBe(true);
    expect(wrapper.state().inputValue).toBe('1');
    wrapper.find('.rc-select-dropdown-menu-item').first().simulate('click');
    expect(wrapper.state().inputValue).toBe(mode === 'multiple' ? '1' : '');
  });
}
