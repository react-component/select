/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import Select from '../src/Select';
import Option from '../src/Option';
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

  it('display correct label when value changes', (done) => {
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

    wrapper.setProps({ value: { label: 'One', key: '1' } }, () => {
      expect(wrapper.find('input').props().value).toBe('One');
      done();
    });
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

    expect(handleChange.mock.calls.length).toBe(1);
    expect(handleChange.mock.calls[0]).toEqual(['1']);
  });

  it('set inputValue when user select a option', (done) => {
    const wrapper = mount(
      <Select combobox>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    wrapper.setState({ open: true }, () => {
      // 这里因为 ReactDOM.currentTrigger 跟 wrapper 的 root 不同，
      // 在 ReactDOM.currentTrigger 模拟事件的时候其实隐式地调用了
      // wrapper 的 setState，所以下面要 setTimeout 一下
      ReactDOM.currentTrigger.find('MenuItem').first().simulate('click');
      setTimeout(() => {
        expect(wrapper.state().inputValue).toBe('1');
        done();
      });
    });
  });
});
