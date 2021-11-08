import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import Select from '../src';

describe('Select.Focus', () => {
  it('disabled should reset focused', () => {
    jest.clearAllTimers();
    jest.useFakeTimers();

    jest.clearAllTimers();

    const wrapper = mount(<Select />);

    // Focus
    wrapper.find('input').simulate('focus');
    act(() => {
      jest.runAllTimers();
      wrapper.update();
    });
    expect(wrapper.exists('.rc-select-focused')).toBeTruthy();

    // Disabled
    wrapper.setProps({ disabled: true });
    act(() => {
      jest.runAllTimers();
      wrapper.update();
    });
    expect(wrapper.exists('.rc-select-focused')).toBeFalsy();

    jest.useRealTimers();
  });
});
