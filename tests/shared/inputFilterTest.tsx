import { mount } from 'enzyme';
import React from 'react';
import Option from '../../src/Option';
import Select from '../../src/Select';

export default function inputFilterTest(mode) {
  it('should keep input filter after select when autoClearSearchValue is false', () => {
    const wrapper = mount<Select>(
      <Select {...{ [mode]: true }} autoClearSearchValue={false}>
        <Option value="11">11</Option>
        <Option value="12">12</Option>
        <Option value="22">22</Option>
      </Select>,
    );
    const input = wrapper.find('input');
    input.simulate('change', {
      target: {
        value: '1',
      },
    });

    expect(wrapper.state().open).toBe(true);
    expect(wrapper.state().inputValue).toBe('1');
    wrapper
      .find('.rc-select-dropdown-menu-item')
      .first()
      .simulate('click');
    expect(wrapper.state().inputValue).toBe(mode === 'single' ? '' : '1');
  });

  it('should clear input filter after select', () => {
    const wrapper = mount<Select>(
      <Select {...{ [mode]: true }}>
        <Option value="11">11</Option>
        <Option value="12">12</Option>
        <Option value="22">22</Option>
      </Select>,
    );
    const input = wrapper.find('input');
    input.simulate('change', {
      target: {
        value: '1',
      },
    });

    expect(wrapper.state().open).toBe(true);
    expect(wrapper.state().inputValue).toBe('1');
    wrapper
      .find('.rc-select-dropdown-menu-item')
      .first()
      .simulate('click');
    expect(wrapper.state().inputValue).toBe('');
  });
}
