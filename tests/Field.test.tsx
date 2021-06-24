/* eslint-disable import/no-named-as-default-member */
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import * as React from 'react';
import Select from '../src';
import { injectRunAllTimers } from './utils/common';

describe('Select.Field', () => {
  injectRunAllTimers(jest);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('fieldNames should work', () => {
    const onChange = jest.fn();

    const wrapper = mount(
      <Select
        open
        onChange={onChange}
        options={
          [
            {
              bambooLabel: 'Bamboo',
              bambooChildren: [
                { bambooLabel: 'Light', bambooValue: 'light' },
                { bambooLabel: 'Little', bambooValue: 'little' },
              ],
            },
          ] as any
        }
        fieldNames={{
          label: 'bambooLabel',
          value: 'bambooValue',
          options: 'bambooChildren',
        }}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });

    // Label match
    expect(wrapper.find('.rc-select-item-group').text()).toEqual('Bamboo');
    expect(wrapper.find('.rc-select-item-option').first().text()).toEqual('Light');
    expect(wrapper.find('.rc-select-item-option').last().text()).toEqual('Little');

    // Click
    wrapper.find('.rc-select-item-option-content').last().simulate('click');
    expect(onChange).toHaveBeenCalledWith(2333);
  });
});
