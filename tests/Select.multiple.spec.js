/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import Select, { Option, OptGroup } from '../src';
import allowClearTest from './shared/allowClearTest';
import blurTest from './shared/blurTest';
import renderTest from './shared/renderTest';
import removeSelectedTest from './shared/removeSelectedTest';

describe('Select.multiple', () => {
  allowClearTest('multiple');
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
          <Option value="1">One</Option>
        </OptGroup>
        <OptGroup key="group2">
          <Option value="2">Two</Option>
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

    expect(handleChange).toBeCalledWith(['1', '2']);
    expect(wrapper.state().value).toEqual([
      { key: '1', label: 'One' },
      { key: '2', label: 'Two' },
    ]);
    expect(wrapper.state().inputValue).toBe('');
    expect(wrapper.state().open).toBe(false);
    expect(input.node.focus).toBeCalled();
  });

  it('focus', () => {
    const handleFocus = jest.fn();
    const wrapper = mount(
      <Select
        multiple
      >
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>,
    );
    wrapper.find('div').first().simulate('focus');
    it('fires focus event', () => {
      expect(handleFocus).toBeCalled();
    });
  });

  it('OptGroup without key', () => {
    expect(() => {
      mount(
        <Select
          multiple
          defaultValue={['1']}
        >
          <OptGroup label="group1">
            <Option value="1">One</Option>
          </OptGroup>
          <OptGroup label="group2">
            <Option value="2">Two</Option>
          </OptGroup>
        </Select>,
      );
    }).not.toThrow();
  });

  it('allow non-string value', () => {
    const handleChange = jest.fn();

    const wrapper = mount(
      <Select multiple defaultValue={[1]} onChange={handleChange}>
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>
    );

    wrapper.find('.rc-select').simulate('click');
    wrapper.find('MenuItem').at(1).simulate('click');

    expect(handleChange).toBeCalledWith([1, 2]);
  });
});
