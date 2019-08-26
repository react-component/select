import { mount } from 'enzyme';
import * as React from 'react';
import Option from '../../src/Option';
import Select from '../../src/Select';

export default function openControlledTest(mode: any) {
  it('selectTriggerRef.props.visible should be equal to props.open', () => {
    const wrapper = mount(
      <Select open mode={mode}>
        <Option value="11">11</Option>
        <Option value="12">12</Option>
        <Option value="22">22</Option>
      </Select>,
    );
    expect(wrapper.find('.rc-select').hasClass('rc-select-open')).toBeTruthy();
    wrapper.setProps({ open: false });
    wrapper.update();
    expect(wrapper.find('.rc-select').hasClass('rc-select-open')).toBeFalsy();
  });
}
