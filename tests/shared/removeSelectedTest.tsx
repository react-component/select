import KeyCode from 'rc-util/lib/KeyCode';
import React from 'react';
import Select, { Option } from '../../src';
import { removeSelection, toggleOpen, selectItem, keyDown } from '../utils/common';
import { render } from '@testing-library/react';

export default function removeSelectedTest(mode: any) {
  describe('remove selected options', () => {
    it('fires deselect and change', () => {
      const handleDeselect = jest.fn();
      const handleChange = jest.fn();
      const { container } = render(
        <Select value={['1', '2']} onChange={handleChange} onDeselect={handleDeselect} mode={mode}>
          <Option value="1" testprop="deselect">
            1
          </Option>
          <Option value="2">2</Option>
        </Select>,
      );
      removeSelection(container);

      expect(handleDeselect).toBeCalledWith(
        '1',
        expect.objectContaining({ value: '1', testprop: 'deselect' }),
      );
      expect(handleChange).toBeCalledWith(['2'], expect.anything());
    });

    it('noop if select is disabled', () => {
      const handleDeselect = jest.fn();
      const handleChange = jest.fn();
      const { container } = render(
        <Select
          value={['1']}
          onChange={handleChange}
          onDeselect={handleDeselect}
          disabled
          mode={mode}
        >
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      );

      expect(container.querySelector('.rc-select-selection-item-remove')).toBeFalsy();
    });

    it('wrap value when labelInValue', () => {
      const handleDeselect = jest.fn();
      const handleChange = jest.fn();
      const { container } = render(
        <Select
          value={[{ key: '1' }, { key: '2' }]}
          onChange={handleChange}
          onDeselect={handleDeselect}
          labelInValue
          mode={mode}
        >
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      );
      removeSelection(container);

      expect(handleDeselect).toHaveBeenCalledWith(
        expect.objectContaining({ key: '1', label: '1' }),
        expect.objectContaining({ value: '1' }),
      );

      expect(handleChange).toHaveBeenCalledWith(
        [expect.objectContaining({ key: '2', label: '2' })],
        [expect.objectContaining({ value: '2' })],
      );
    });

    it('remove by backspace key', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Select defaultValue={['1', '2']} mode={mode} onChange={onChange}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      );

      keyDown(container.querySelector('input'), KeyCode.BACKSPACE);
      expect(onChange).toHaveBeenCalledWith(['1'], [expect.objectContaining({ value: '1' })]);
    });

    it('remove by menu deselect', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Select defaultValue={['1']} mode={mode} onChange={onChange}>
          <Option value="1">1</Option>
        </Select>,
      );

      toggleOpen(container);
      selectItem(container);

      expect(container.querySelector('input').value).toBe('');
      expect(onChange).toHaveBeenCalledWith([], []);
    });
  });
}
