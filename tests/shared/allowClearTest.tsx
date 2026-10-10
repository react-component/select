import * as React from 'react';
import Select, { Option } from '../../src';
import { createEvent, fireEvent, render } from '@testing-library/react';

export default function allowClearTest(mode: any, value: any) {
  describe('allowClear', () => {
    it('renders correctly', () => {
      const { container } = render(<Select mode={mode} value={value} allowClear />);
      expect(container.querySelector('.rc-select-clear')).toBeTruthy();
    });

    it('renders clear as a button', () => {
      const { container } = render(<Select mode={mode} value={value} allowClear />);
      const clear = container.querySelector('.rc-select-clear');
      expect(clear.tagName).toBe('BUTTON');
      expect(clear).toHaveAttribute('type', 'button');
    });

    it('prevents default on mousedown to keep focus on input', () => {
      const { container } = render(<Select mode={mode} value={value} allowClear />);
      const clear = container.querySelector('.rc-select-clear');
      const mouseDownEvent = createEvent.mouseDown(clear);
      fireEvent(clear, mouseDownEvent);
      expect(mouseDownEvent.defaultPrevented).toBe(true);
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
      fireEvent.click(container.querySelector('.rc-select-clear'));
      if (useArrayValue) {
        expect(onChange).toHaveBeenCalledWith([], []);
      } else {
        expect(onChange).toHaveBeenCalledWith(undefined, undefined);
      }
      expect(onDeselect).not.toHaveBeenCalled();
      expect(container.querySelector('input').value).toEqual('');
      expect(onClear).toHaveBeenCalled();
    });

    it('clears value with keyboard', () => {
      ['Enter', ' '].forEach((key) => {
        const onClear = jest.fn();
        const onChange = jest.fn();
        const onDeselect = jest.fn();
        const useArrayValue = ['tags', 'multiple'].includes(mode);

        const { container } = render(
          <Select
            defaultValue={useArrayValue ? ['1'] : '1'}
            mode={mode}
            allowClear
            onClear={onClear}
            onChange={onChange}
            onDeselect={onDeselect}
          >
            <Option value="1">1</Option>
            <Option value="2">2</Option>
          </Select>,
        );
        const clear = container.querySelector('.rc-select-clear');
        const keyDownEvent = createEvent.keyDown(clear, { key });

        fireEvent(clear, keyDownEvent);

        expect(keyDownEvent.defaultPrevented).toBe(false);
        expect(container.querySelector('.rc-select-open')).toBeFalsy();

        // The native button activation should fire a click
        fireEvent.click(clear);

        if (useArrayValue) {
          expect(onChange).toHaveBeenCalledWith([], []);
        } else {
          expect(onChange).toHaveBeenCalledWith(undefined, undefined);
        }
        expect(onDeselect).not.toHaveBeenCalled();
        expect(container.querySelector('input').value).toEqual('');
        expect(onClear).toHaveBeenCalled();
      });
    });
  });
}
