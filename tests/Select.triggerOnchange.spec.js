/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import Select, { Option } from '../src';

describe('test test test', () => {
  it('fires input change by default ', () => {
    const wrapper = mount(
      <Select combobox>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    wrapper.find('.rc-select').simulate('click');
    const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());

    dropdownWrapper.find('MenuItem').first().simulate('click');
    expect(wrapper.state().inputValue).toBe('1');
  });

  it('not fires input change when triggerOnchange is true ', () => {
    const wrapper = mount(
      <Select combobox triggerOnchange={false}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    wrapper.find('.rc-select').simulate('click');
    const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());

    dropdownWrapper.find('MenuItem').first().simulate('click');
    expect(wrapper.state().inputValue).toBe('');
  });
});
