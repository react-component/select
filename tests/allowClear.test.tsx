import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import Select from '../src';
import { resetWarned } from '@rc-component/util';

describe.each([undefined, 'multiple', 'tags', 'combobox'] as const)(
  'allowClear mode=%s',
  (mode) => {
    it('disables the clear entry and restores the complete configuration', () => {
      const onClear = jest.fn();
      const onChange = jest.fn();
      const props = {
        mode,
        defaultValue: 'one',
        onClear,
        onChange,
        options: [{ value: 'one' }],
        suffix: 'suffix',
      };
      const config = Object.freeze({ clearIcon: 'custom', label: 'Erase', tabIndex: -1 });
      const { container, getByRole, queryByRole, rerender } = render(
        <Select {...props} allowClear={false} />,
      );
      const markup = container.innerHTML;
      rerender(<Select {...props} allowClear={{ ...config, disabled: true }} />);
      expect(container.innerHTML).toBe(markup);
      expect(queryByRole('button', { name: 'Erase' })).toBeNull();
      expect(onClear).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
      expect(container.querySelector('.rc-select-suffix')).toHaveTextContent('suffix');

      rerender(<Select {...props} allowClear={config} />);
      const button = getByRole('button', { name: 'Erase' });
      expect(button).toHaveTextContent('custom');
      expect(button.tabIndex).toBe(-1);
      fireEvent.click(button);
      expect(onClear).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(
        mode === 'multiple' || mode === 'tags' ? [] : undefined,
        mode === 'multiple' || mode === 'tags' ? [] : undefined,
      );
      expect(queryByRole('button', { name: 'Erase' })).toBeNull();
    });
  },
);

it('does not override component disabled or empty-value restrictions', () => {
  const { queryByRole, rerender } = render(
    <Select value="one" disabled allowClear={{ disabled: false }} />,
  );
  expect(queryByRole('button', { name: 'Clear' })).toBeNull();
  rerender(<Select allowClear={{ disabled: false }} />);
  expect(queryByRole('button', { name: 'Clear' })).toBeNull();
});

it('updates the clear tabIndex without changing the input tabIndex', () => {
  const { getByRole, rerender } = render(
    <Select value="one" tabIndex={3} allowClear={{ tabIndex: -1 }} />,
  );
  expect(getByRole('button', { name: 'Clear' }).tabIndex).toBe(-1);
  expect(getByRole('combobox').tabIndex).toBe(3);
  rerender(<Select value="one" tabIndex={3} allowClear={{ tabIndex: 0, label: 'Erase' }} />);
  expect(getByRole('button', { name: 'Erase' }).tabIndex).toBe(0);
  expect(getByRole('combobox').tabIndex).toBe(3);
});

it('treats a disabled clear configuration as false in custom-input warnings', () => {
  resetWarned();
  const warning = jest.spyOn(console, 'warn').mockImplementation(() => {});
  try {
    const props = {
      mode: 'combobox' as const,
      getInputElement: () => <input />,
      placeholder: 'Search',
    };
    const { rerender } = render(<Select {...props} allowClear={{ disabled: true }} />);
    expect(warning).not.toHaveBeenCalled();
    rerender(<Select {...props} allowClear />);
    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining('Customize \x60getInputElement\x60 should customize clear'),
    );
  } finally {
    warning.mockRestore();
    resetWarned();
  }
});
