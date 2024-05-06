import React, { act } from 'react';
import Select from '../src';
import type { SelectProps } from '../src';
import { injectRunAllTimers } from './utils/common';
import { fireEvent, render } from '@testing-library/react';

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
    return render(
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

    const { container } = mountSelect({ onChange, onSelect });

    act(() => {
      jest.runAllTimers();
    });

    // Label match
    expect(container.querySelector('.rc-select-item-group').textContent).toEqual('Bamboo');
    expect(container.querySelector('.rc-select-item-option').textContent).toEqual('Light');
    expect(container.querySelectorAll('.rc-select-item-option')[1].textContent).toEqual('Little');

    // Click
    fireEvent.click(container.querySelectorAll('.rc-select-item-option-content')[1]);
    expect(onChange).toHaveBeenCalledWith('little', OPTION_2);
    expect(onSelect).toHaveBeenCalledWith('little', OPTION_2);
  });

  it('multiple', () => {
    const onChange = jest.fn();
    const { container } = mountSelect({ mode: 'multiple', onChange });

    // First one
    fireEvent.click(container.querySelector('.rc-select-item-option-content')!);
    expect(onChange).toHaveBeenCalledWith(['light'], [OPTION_1]);

    // Last one
    onChange.mockReset();
    fireEvent.click(container.querySelectorAll('.rc-select-item-option-content')[1]);
    expect(onChange).toHaveBeenCalledWith(['light', 'little'], [OPTION_1, OPTION_2]);
  });
});
