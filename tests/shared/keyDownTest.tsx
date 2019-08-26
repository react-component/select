import { mount } from 'enzyme';
import * as React from 'react';
import Option from '../../src/Option';
import Select from '../../src/Select';

export default function keyDownTest(mode: any) {
  it('triggers keyDown', () => {
    const onInputKeyDown = jest.fn();
    const wrapper = mount(
      <Select mode={mode} onInputKeyDown={onInputKeyDown}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    wrapper.find('input').simulate('keydown');
    expect(onInputKeyDown).toHaveBeenCalled();
  });
}
