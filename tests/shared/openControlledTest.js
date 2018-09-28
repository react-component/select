/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import Select from '../../src/Select';
import Option from '../../src/Option';

export default function openControlledTest(mode) {
  it('selectTriggerRef.props.visible should be equal to props.open', () => {
    const wrapper = mount(
      <Select
        open
        {...{ [mode]: true } }
      >
        <Option value="11">11</Option>
        <Option value="12">12</Option>
        <Option value="22">22</Option>
      </Select>
    );
    expect(wrapper.instance().selectTriggerRef.props.visible).toBe(true);
    wrapper.setProps({ open: false });
    wrapper.update();
    expect(wrapper.instance().selectTriggerRef.props.visible).toBe(false);
  });
}
