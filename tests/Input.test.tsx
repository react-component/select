import React from 'react';
import { mount } from 'enzyme';
import Input from '../src/Selector/Input';

describe('Selector.Input', () => {
  it('renders correctly', () => {
    const noop = () => null;
    const wrapper = mount(
      <Input
        prefixCls=""
        id="abc"
        inputElement={<input />}
        disabled={false}
        autoFocus={false}
        editable={false}
        accessibilityIndex={1}
        value="abc"
        open={false}
        tabIndex={-5}
        onKeyDown={noop}
        onMouseDown={noop}
        onChange={noop}
      />,
    );

    expect(wrapper.find('input').prop('type')).toBe('search');
  });
});
