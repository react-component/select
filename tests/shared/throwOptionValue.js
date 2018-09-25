import React from 'react';
import { mount } from 'enzyme';
import Select from '../../src/Select';
import Option from '../../src/Option';

export default function throwOptionValue(mode) {
  it('warn option value type', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const render = () => mount(
      <Select {...{ [mode]: true }} open>
        <Option value={1}>1</Option>
      </Select>
    );

    expect(render).toThrow(
      'Invalid `value` of type `number` supplied to Option, ' +
      'expected `string` when `tags/combobox` is `true`.'
    );

    spy.mockReset();
    spy.mockRestore();
  });
}
