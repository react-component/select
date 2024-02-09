import { mount } from 'enzyme';
import React, { useState } from 'react';
import { act } from 'react-dom/test-utils';
import Select from '../src';
import { fireEvent, render } from '@testing-library/react';

describe('Select.Focus', () => {
  it('disabled should reset focused', () => {
    jest.clearAllTimers();
    jest.useFakeTimers();

    jest.clearAllTimers();

    const wrapper = mount(<Select />);

    // Focus
    wrapper.find('.rc-select-selection-search-input').simulate('focus');
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

  it('after onBlur is triggered the focused does not need to be reset', () => {
    jest.useFakeTimers();

    const onFocus = jest.fn();

    const Demo: React.FC = () => {
      const [disabled, setDisabled] = useState(false);
      return (
        <>
          <Select disabled={disabled} onFocus={onFocus} onBlur={() => setDisabled(true)} />
          <button onClick={() => setDisabled(false)} />
        </>
      );
    };

    const { container } = render(<Demo />);

    fireEvent.focus(container.querySelector('.rc-select-selection-search-input'));
    jest.runAllTimers();

    // trigger disabled
    fireEvent.blur(container.querySelector('.rc-select-selection-search-input'));
    jest.runAllTimers();

    // reset focused
    onFocus.mockReset();

    expect(container.querySelector('.rc-select-disabled')).toBeTruthy();

    // reset disabled
    fireEvent.click(container.querySelector('button'));
    fireEvent.focus(container.querySelector('.rc-select-selection-search-input'));
    jest.runAllTimers();

    expect(onFocus).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('IE focus', () => {
    jest.clearAllTimers();
    jest.useFakeTimers();

    jest.clearAllTimers();

    (document.body.style as any).msTouchAction = true;
    const wrapper = mount(<Select mode="tags" value="bamboo" />);

    const focusFn = jest.spyOn(wrapper.find('.rc-select-selection-search-input').instance(), 'focus' as any);

    wrapper.find('.rc-select-selector').simulate('click');
    jest.runAllTimers();

    expect(focusFn).toHaveBeenCalled();

    jest.useRealTimers();
  });
});
