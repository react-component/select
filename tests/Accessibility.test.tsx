import { mount } from 'enzyme';
import * as React from 'react';
import Select from '../src';
import { injectRunAllTimers } from './utils/common';

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
});
