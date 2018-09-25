/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import Select from '../../src/Select';
import Option from '../../src/Option';

export default function blurTest(mode) {
  let wrapper;
  let container;

  beforeEach(() => {
    container = global.document.createElement('div');
    global.document.body.appendChild(container);

    wrapper = mount(
      <Select {...{ [mode]: true }}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
      { attachTo: container }
    );
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('clears inputValue', () => {
    wrapper.find('input').simulate('change', { target: { value: '1' } });
    wrapper.find('.rc-select').simulate('blur');
    jest.runAllTimers();

    expect(wrapper.find('input').getDOMNode().value).toBe('');
    expect(wrapper.state().inputValue).toBe('');
  });

  it('blur()', () => {
    const handleBlur = jest.fn();
    wrapper.setProps({ onBlur: handleBlur });
    wrapper.instance().focus();
    wrapper.instance().blur();
    jest.runAllTimers();
    expect(handleBlur).toBeCalled();
  });
}
