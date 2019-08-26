import { mount } from 'enzyme';
import * as React from 'react';
import Option from '../../src/Option';
import Select from '../../src/Select';
import { expectOpen } from '../utils/common';

export default function openControlledTest(mode: any) {
  it('selectTriggerRef.props.visible should be equal to props.open', () => {
    const wrapper = mount(
      <Select open mode={mode}>
        <Option value="11">11</Option>
        <Option value="12">12</Option>
        <Option value="22">22</Option>
      </Select>,
    );

    expectOpen(wrapper);
    wrapper.setProps({ open: false });
    wrapper.update();
    expectOpen(wrapper, false);
  });
}
