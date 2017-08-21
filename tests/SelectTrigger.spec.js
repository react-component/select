/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import { mountToJson } from 'enzyme-to-json';
import SelectTrigger from '../src/SelectTrigger';

describe('SelectTrigger', () => {
  it('renders correctly', () => {
    const wrapper = mount(
      <SelectTrigger
        prefixCls="rc-select"
        transitionName="slide"
      >
        <div>foo</div>
      </SelectTrigger>
    );

    expect(mountToJson(wrapper)).toMatchSnapshot();
  });

  it('set popupTransitionName if animation given', () => {
    const wrapper = mount(
      <SelectTrigger
        prefixCls="rc-select"
        animation="slide-up"
      >
        <div>foo</div>
      </SelectTrigger>
    );

    expect(wrapper.find('Trigger').props().popupTransitionName).toBe('rc-select-dropdown-slide-up');
  });
});
