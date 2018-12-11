import { mount } from 'enzyme';
import React from 'react';
import Option from '../../src/Option';
import Select from '../../src/Select';

export default function throwOptionValue(mode) {
  it('warn option value type', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => null);

    const render = () =>
      mount(
        <Select {...{ [mode]: true }} open={true}>
          <Option value={1}>1</Option>
        </Select>,
      );

    expect(render).toThrow(
      'Invalid `value` of type `number` supplied to Option, ' +
        'expected `string` when `tags/combobox` is `true`.',
    );

    spy.mockReset();
    spy.mockRestore();
  });
}
