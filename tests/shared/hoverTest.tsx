import { mount } from 'enzyme';
import * as React from 'react';
import Option from '../../src/Option';
import Select from '../../src/Select';

export default function hoverTest(mode) {
  it('triggers mouseEnter and mouseLeave', () => {
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();
    const wrapper = mount(
      <Select {...{ [mode]: true }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    wrapper
      .find('.rc-select')
      .first()
      .simulate('mouseenter');
    expect(onMouseEnter).toBeCalled();
    wrapper
      .find('.rc-select')
      .first()
      .simulate('mouseleave');
    expect(onMouseLeave).toBeCalled();
  });
}
