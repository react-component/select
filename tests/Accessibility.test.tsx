import { mount } from 'enzyme';
import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import Select from '../src';
import { injectRunAllTimers, expectOpen } from './utils/common';

describe('Select.Accessibility', () => {
  injectRunAllTimers(jest);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('pass aria info to internal input', () => {
    const MySelect = Select as any;
    const wrapper = mount(<MySelect aria-label="light" data-attr="bamboo" useless="2333" />);
    expect(wrapper.find('input').props()).toEqual(
      expect.objectContaining({
        'aria-label': 'light',
      }),
    );
  });

  // https://github.com/ant-design/ant-design/issues/31850
  it('active index should keep', () => {
    const wrapper = mount(
      <Select
        showSearch
        options={[
          {
            label: 'Little',
            value: 'little',
          },
          {
            label: 'Bamboo',
            value: 'bamboo',
          },
          {
            label: 'Light',
            value: 'light',
          },
        ]}
      />,
    );

    // First Match
    wrapper.find('input').simulate('change', { target: { value: 'b' } });
    jest.runAllTimers();

    expectOpen(wrapper);
    expect(
      wrapper.find('.rc-select-item-option-active .rc-select-item-option-content').text(),
    ).toEqual('Bamboo');

    wrapper.find('input').simulate('keyDown', { which: KeyCode.ENTER });
    expectOpen(wrapper, false);

    // Next Match
    wrapper.find('input').simulate('change', { target: { value: '' } });
    wrapper.find('input').simulate('change', { target: { value: 'g' } });
    jest.runAllTimers();

    expectOpen(wrapper);
    expect(
      wrapper.find('.rc-select-item-option-active .rc-select-item-option-content').text(),
    ).toEqual('Light');
  });
});
