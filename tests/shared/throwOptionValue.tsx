import { mount } from 'enzyme';
import React from 'react';
import Select, { Option } from '../../src';
import { resetWarned } from 'rc-util/lib/warning';

export default function throwOptionValue(mode: any) {
  it('warn option value type', () => {
    resetWarned();

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => null);

    mount(
      <Select mode={mode} open>
        <Option value={1}>1</Option>
      </Select>,
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `value` of Option should not use number type when `mode` is `tags` or `combobox`.',
    );

    errorSpy.mockRestore();
  });
}
