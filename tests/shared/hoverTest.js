/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import Select from '../../src/Select';
import Option from '../../src/Option';

export default function hoverTest(mode) {
  it('triggers mouseEnter and mouseLeave', () => {
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();
    const wrapper = mount(
      <Select {...{ [mode]: true }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    wrapper.find('.rc-select').first().simulate('mouseenter');
    expect(onMouseEnter).toBeCalled();
    wrapper.find('.rc-select').first().simulate('mouseleave');
    expect(onMouseLeave).toBeCalled();
  });
}
