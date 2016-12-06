/* eslint-disable no-undef */
import React from 'react';
import Select, { Option } from '../src';
import { mount, render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';

describe('Select.combobox', () => {
  it('renders correctly', () => {
    const wrapper = render(
      <Select combobox placeholder="Search">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('set inputValue based on value', () => {
    const wrapper = mount(
      <Select combobox value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    expect(wrapper.state().inputValue).toBe('1');
  });

  it('display correct label when value changes', () => {
    const wrapper = mount(
      <Select
        combobox
        labelInValue
        value={{ value: '', key: '' }}
        optionLabelProp="children"
      >
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>
    );

    wrapper.setProps({ value: { label: 'One', key: '1' } });
    expect(wrapper.find('input').props().value).toBe('One');
  });

  it('fire change event immediately when user inputing', () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      <Select combobox onChange={handleChange}>
        <Option value="11">11</Option>
        <Option value="22">22</Option>
      </Select>
    );

    wrapper.find('input').simulate('change', { target: { value: '1' } });

    expect(handleChange).toBeCalledWith('1');
  });

  it('set inputValue when user select a option', () => {
    const wrapper = mount(
      <Select combobox>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    wrapper.find('.rc-select').simulate('click');
    const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());

    dropdownWrapper.find('MenuItem').first().simulate('click');
    expect(wrapper.state().inputValue).toBe('1');
  });

  it('combox could comstomize input element', () => {
    const wrapper = mount(
      <Select combobox getInputElement={() => <textarea />}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    expect(wrapper.find('textarea').length).toBe(1);
    wrapper.find('.rc-select').simulate('click');
    const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());

    dropdownWrapper.find('MenuItem').first().simulate('click');
    expect(wrapper.state().inputValue).toBe('1');
  });
});
