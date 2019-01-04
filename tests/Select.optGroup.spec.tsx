import { mount } from 'enzyme';
import * as React from 'react';
import Select, { OptGroup, Option } from '../src';
import { resetAriaId } from '../src/util';

describe('Select.optionGroup', () => {
  beforeEach(() => {
    resetAriaId();
  });

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
