/* eslint-disable no-undef */
import React from 'react';
import Select from '../../src/Select';
import Option from '../../src/Option';
import { mount } from 'enzyme';

export default function keyDownTest(mode) {
  it('triggers keyDown', () => {
    const onInputKeyDown = jest.fn();
    const wrapper = mount(
      <Select {...{ [mode]: true }} onInputKeyDown={onInputKeyDown}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    wrapper.find('input').simulate('keydown');
    expect(onInputKeyDown).toBeCalled();
  });
}
