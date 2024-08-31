import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import Select from '../src';
import { injectRunAllTimers } from './utils/common';

// Mock Trigger. Since `__mocks__` already mock the trigger, we should back of origin one.
jest.mock('@rc-component/trigger', () => {
  const OriTrigger = jest.requireActual('@rc-component/trigger').default;
  return OriTrigger;
});

describe('Select.Popup', () => {
  injectRunAllTimers(jest);

  it('click popup should not trigger close', () => {
    const onDropdownVisibleChange = jest.fn();
    render(
      <Select
        open
        options={[{ value: 'bamboo' }]}
        onDropdownVisibleChange={onDropdownVisibleChange}
        getPopupContainer={() => document.body}
      />,
    );

    fireEvent.mouseDown(document.querySelector('.rc-select-dropdown'));
    expect(onDropdownVisibleChange).not.toHaveBeenCalled();
  });
});
