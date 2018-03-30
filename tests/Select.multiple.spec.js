/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import Select, { Option, OptGroup } from '../src';
import allowClearTest from './shared/allowClearTest';
import focusTest from './shared/focusTest';
import blurTest from './shared/blurTest';
import hoverTest from './shared/hoverTest';
import renderTest from './shared/renderTest';
import removeSelectedTest from './shared/removeSelectedTest';
import dynamicChildrenTest from './shared/dynamicChildrenTest';

describe('Select.multiple', () => {
  allowClearTest('multiple');
  focusTest('multiple');
  blurTest('multiple');
  hoverTest('multiple');
  renderTest('multiple');
  removeSelectedTest('multiple');
  dynamicChildrenTest('multiple');

  it('tokenize input', () => {
    const handleChange = jest.fn();
    const handleSelect = jest.fn();
    const wrapper = mount(
      <Select
        multiple
        optionLabelProp="children"
        tokenSeparators={[',']}
        onChange={handleChange}
        onSelect={handleSelect}
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
    input.instance().focus = jest.fn();

    input.simulate('change', { target: {
      value: 'One',
    } });

    input.simulate('change', { target: {
      value: 'One,Two,Three',
    } });

    input.simulate('change', { target: {
      value: 'One,Two',
    } });

    expect(handleChange).toBeCalledWith(['1', '2'], expect.anything());
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledTimes(2);
    expect(wrapper.state().value).toEqual(['1', '2']);
    expect(wrapper.find('.rc-select-selection__choice__content').at(0).text()).toEqual('One');
    expect(wrapper.find('.rc-select-selection__choice__content').at(1).text()).toEqual('Two');
    expect(wrapper.state().inputValue).toBe('');
    expect(wrapper.state().open).toBe(false);
    expect(input.instance().focus).toBeCalled();
  });

  it('focus', () => {
    const handleFocus = jest.fn();
    const wrapper = mount(
      <Select
        multiple
        onFocus={handleFocus}
      >
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>,
    );
    jest.useFakeTimers();
    wrapper.find('.rc-select').simulate('focus');
    jest.runAllTimers();
    expect(handleFocus).toBeCalled();
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

  it('allow number value', () => {
    const handleChange = jest.fn();

    const wrapper = mount(
      <Select multiple defaultValue={1} onChange={handleChange}>
        <Option value={1}>1</Option>
        <Option value={2} testprop={2}>2</Option>
      </Select>
    );

    expect(
      wrapper.find('.rc-select-selection__choice__content').text()
    ).toBe('1');

    wrapper.find('.rc-select').simulate('click');
    wrapper.find('MenuItem').at(1).simulate('click');
    expect(handleChange).toBeCalledWith([1, 2], [
      <Option value={1}>1</Option>,
      <Option value={2} testprop={2}>2</Option>,
    ]);
    expect(
      wrapper.find('.rc-select-selection__choice__content').at(1).text()
    ).toBe('2');
  });
});
