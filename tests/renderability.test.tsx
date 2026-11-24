import React from 'react';
import { render } from '@testing-library/react';
import Select from '../src';

it('opens an empty dropdown containing zero', () => {
  const { baseElement } = render(<Select open options={[]} notFoundContent={0} />);
  expect(baseElement.querySelector('.rc-select-item-empty').textContent).toBe('0');
});

it('only renders a zero selection icon on selected options', () => {
  const { baseElement } = render(
    <Select
      open
      mode="multiple"
      value={['a']}
      virtual={false}
      menuItemSelectedIcon={0}
      options={[
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ]}
    />,
  );
  expect(baseElement.querySelectorAll('.rc-select-item-option-state')).toHaveLength(1);
  expect(
    baseElement.querySelector('.rc-select-item-option-selected .rc-select-item-option-state')
      .textContent,
  ).toBe('0');
});

it('keeps a zero option label in the dropdown and selected value', () => {
  const { container, baseElement } = render(
    <Select open value="a" options={[{ value: 'a', label: 0 }]} />,
  );
  expect(baseElement.querySelector('.rc-select-item-option-content').textContent).toBe('0');
  expect(container.querySelector('.rc-select-content-has-value')).toBeTruthy();
});
