/* eslint-disable import/no-named-as-default-member */
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import * as React from 'react';
import Select from '../src';
import type { SelectProps } from '../src';
import { injectRunAllTimers } from './utils/common';

describe('Select.Field', () => {
  injectRunAllTimers(jest);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const OPTION_1 = { bambooLabel: 'Light', bambooValue: 'light' };
  const OPTION_2 = { bambooLabel: 'Little', bambooValue: 'little' };

  function mountSelect(props?: Partial<SelectProps<any>>) {
    return mount(
      <Select
        open
        options={
          [
            {
              bambooLabel: 'Bamboo',
              bambooChildren: [OPTION_1, OPTION_2],
            },
          ] as any
        }
        fieldNames={{
          label: 'bambooLabel',
          value: 'bambooValue',
          options: 'bambooChildren',
        }}
        {...props}
      />,
    );
  }

  it('fieldNames should work', () => {
    const onChange = jest.fn();
    const onSelect = jest.fn();

    const wrapper = mountSelect({ onChange, onSelect });

    act(() => {
      jest.runAllTimers();
    });

    // Label match
    expect(wrapper.find('.rc-select-item-group').text()).toEqual('Bamboo');
    expect(wrapper.find('.rc-select-item-option').first().text()).toEqual('Light');
    expect(wrapper.find('.rc-select-item-option').last().text()).toEqual('Little');

    // Click
    wrapper.find('.rc-select-item-option-content').last().simulate('click');
    expect(onChange).toHaveBeenCalledWith('little', OPTION_2);
    expect(onSelect).toHaveBeenCalledWith('little', OPTION_2);
  });

  it('multiple', () => {
    const onChange = jest.fn();
    const wrapper = mountSelect({ mode: 'multiple', onChange });

    // First one
    wrapper.find('.rc-select-item-option-content').first().simulate('click');
    expect(onChange).toHaveBeenCalledWith(['light'], [OPTION_1]);

    // Last one
    onChange.mockReset();
    wrapper.find('.rc-select-item-option-content').last().simulate('click');
    expect(onChange).toHaveBeenCalledWith(['light', 'little'], [OPTION_1, OPTION_2]);
  });
});
