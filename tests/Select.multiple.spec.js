/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import Select, { Option, OptGroup } from '../src';
import blurTest from './shared/blurTest';
import renderTest from './shared/renderTest';
import removeSelectedTest from './shared/removeSelectedTest';
import { castNumber } from './util';

describe('Select.multiple', () => {
  blurTest('multiple');
  renderTest('multiple');
  removeSelectedTest('multiple');

  it('tokenize input', () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      <Select
        multiple
        optionLabelProp="children"
        tokenSeparators={[',']}
        onChange={handleChange}
      >
        <OptGroup key="group1">
          <Option value={castNumber('1')}>One</Option>
        </OptGroup>
        <OptGroup key="group2">
          <Option value={castNumber('2')}>Two</Option>
        </OptGroup>
      </Select>,
    );

    const input = wrapper.find('input');
    input.node.focus = jest.fn();

    input.simulate('change', { target: {
      value: 'One',
    } });

    input.simulate('change', { target: {
      value: 'One,Two,Three',
    } });

    expect(handleChange).toBeCalledWith([castNumber('1'), castNumber('2')]);
    expect(wrapper.state().value).toEqual([
      { key: castNumber('1'), label: 'One' },
      { key: castNumber('2'), label: 'Two' },
    ]);
    expect(wrapper.state().inputValue).toBe('');
    expect(wrapper.state().open).toBe(false);
    expect(input.node.focus).toBeCalled();
  });
});
