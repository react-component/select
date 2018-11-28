/* eslint-disable no-undef, react/no-multi-comp */
import React from 'react';
import { mount } from 'enzyme';
import Select, { Option, OptGroup } from '../src';

describe('Select.optionGroup', () => {
  it('group name support search', () => {
    const wrapper = mount(
      <Select>
        <OptGroup label="zombiej">
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </OptGroup>
      </Select>,
    );

    wrapper.find('input').simulate('change', { target: { value: 'zombiej' } });
    expect(wrapper.find('MenuItemGroup').length).toBe(1);
    expect(wrapper.find('MenuItem').length).toBe(2);
  });
});
