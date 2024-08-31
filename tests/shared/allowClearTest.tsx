import * as React from 'react';
import Select, { Option } from '../../src';
import { fireEvent, render } from '@testing-library/react';

export default function allowClearTest(mode: any, value: any) {
  describe('allowClear', () => {
    it('renders correctly', () => {
      const { container } = render(<Select mode={mode} value={value} allowClear />);
      expect(container.querySelector('.rc-select-clear-icon')).toBeTruthy();
    });
    it('clears value', () => {
      const onClear = jest.fn();
      const onChange = jest.fn();
      const onDeselect = jest.fn();
      const useArrayValue = ['tags', 'multiple'].includes(mode);

      const renderDemo = (disabled?: boolean) => (
        <Select
          defaultValue={useArrayValue ? ['1'] : '1'}
          allowClear
          mode={mode}
          onClear={onClear}
          onChange={onChange}
          onDeselect={onDeselect}
          disabled={disabled}
        >
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
      );

      const { container, rerender } = render(renderDemo());

      // disabled
      rerender(renderDemo(true));
      expect(container.querySelector('.rc-select-clear')).toBeFalsy();

      // enabled
      rerender(renderDemo(false));
      fireEvent.mouseDown(container.querySelector('.rc-select-clear'));
      if (useArrayValue) {
        expect(onChange).toHaveBeenCalledWith([], []);
      } else {
        expect(onChange).toHaveBeenCalledWith(undefined, undefined);
      }
      expect(onDeselect).not.toBeCalled();
      expect(container.querySelector('input').value).toEqual('');
      expect(onClear).toHaveBeenCalled();
    });
  });
}
