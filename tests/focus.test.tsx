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

  it('IE focus', () => {
    jest.clearAllTimers();
    jest.useFakeTimers();

    jest.clearAllTimers();

    (document.body.style as any).msTouchAction = true;
    const wrapper = mount(<Select mode="tags" value="bamboo" />);

    const focusFn = jest.spyOn(wrapper.find('input').instance(), 'focus' as any);

    wrapper.find('.rc-select-selector').simulate('click');
    jest.runAllTimers();

    expect(focusFn).toHaveBeenCalled();

    jest.useRealTimers();
  });
});
