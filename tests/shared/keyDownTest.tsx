import { mount } from 'enzyme';
import React from 'react';
import Option from '../../src/Option';
import Select from '../../src/Select';

export default function keyDownTest(mode) {
  it('triggers keyDown', () => {
    const onInputKeyDown = jest.fn();
    const wrapper = mount(
      <Select {...{ [mode]: true }} onInputKeyDown={onInputKeyDown}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    wrapper.find('input').simulate('keydown');
    expect(onInputKeyDown).toBeCalled();
  });
}
