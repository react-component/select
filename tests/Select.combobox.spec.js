/* eslint-disable no-undef */
import React from 'react';
import Select, { Option } from '../src';
import { mount, render } from 'enzyme';
import allowClearTest from './shared/allowClearTest';

describe('Select.combobox', () => {
  allowClearTest('combobox');

  it('renders correctly', () => {
    const wrapper = render(
      <Select combobox placeholder="Search">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    expect(wrapper).toMatchSnapshot();
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

  describe('input value', () => {
    const createSelect = (props) => mount(
      <Select
        combobox
        optionLabelProp="children"
        {...props}
      >
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>
    );

    describe('labelInValue is false', () => {
      it('displays correct input value for defaultValue', () => {
        const wrapper = createSelect({
          defaultValue: '1',
        });
        expect(wrapper.find('input').props().value).toBe('One');
      });

      it('displays correct input value for value', () => {
        const wrapper = createSelect({
          value: '1',
        });
        expect(wrapper.find('input').props().value).toBe('One');
      });
    });

    describe('labelInValue is true', () => {
      it('displays correct input value for defaultValue', () => {
        const wrapper = createSelect({
          labelInValue: true,
          defaultValue: { key: '1', label: 'One' },
        });
        expect(wrapper.find('input').props().value).toBe('One');
      });

      it('displays correct input value for value', () => {
        const wrapper = createSelect({
          labelInValue: true,
          value: { key: '1', label: 'One' },
        });
        expect(wrapper.find('input').props().value).toBe('One');
      });

      it('displays correct input value when value changes', () => {
        const wrapper = createSelect({
          labelInValue: true,
          value: { key: '' },
        });
        wrapper.setProps({ value: { key: '1', label: 'One' } });
        expect(wrapper.find('input').props().value).toBe('One');
      });
    });
  });
});
