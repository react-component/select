import { mount } from 'enzyme';
import React from 'react';
import Select from '../src';
import { toggleOpen } from './utils/common';

describe('Select placeholder', () => {
  it('when searchValue is controlled', () => {
    const wrapper = mount(<Select searchValue="light" placeholder="bamboo" />);
    expect(
      wrapper.find('.rc-select-selection-placeholder').getDOMNode().hasAttribute('style'),
    ).toBe(false);
    toggleOpen(wrapper);
    expect(
      (wrapper.find('.rc-select-selection-placeholder').getDOMNode() as HTMLSpanElement).style
        .visibility,
    ).toBe('hidden');
  });

  it('when value is null', () => {
    const wrapper = mount(<Select value={null} placeholder="bamboo" />);
    expect(wrapper.find('.rc-select-selection-placeholder').length).toBe(1);
    expect(wrapper.find('.rc-select-selection-placeholder').text()).toBe('bamboo');
  });

  it('not when value is null but it is an Option', () => {
    const wrapper = mount(
      <Select value={null} placeholder="bamboo" options={[{ value: null, label: 'light' }]} />,
    );
    expect(wrapper.find('.rc-select-selection-placeholder').length).toBe(0);
    expect(wrapper.find('.rc-select-selection-item').text()).toBe('light');
    toggleOpen(wrapper);
    expect(wrapper.find('.rc-select-selection-item').text()).toBe('light');
  });

  it('should hide placeholder if force closed and showSearch with searchValue', () => {
    const wrapper = mount(
      <Select showSearch searchValue="search" open={false} placeholder="placeholder" />,
    );
    expect(
      (wrapper.find('.rc-select-selection-placeholder').getDOMNode() as HTMLSpanElement).style
        .visibility,
    ).toBe('hidden');
    expect(wrapper.find('.rc-select-selection-placeholder').text()).toBe('placeholder');
  });
});