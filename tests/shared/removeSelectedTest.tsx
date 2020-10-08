import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import React from 'react';
import Select, { Option } from '../../src';
import { removeSelection, toggleOpen, selectItem } from '../utils/common';

export default function removeSelectedTest(mode: any) {
  describe('remove selected options', () => {
    it('fires deselect and change', () => {
      const handleDeselect = jest.fn();
      const handleChange = jest.fn();
      const wrapper = mount(
        <Select value={['1', '2']} onChange={handleChange} onDeselect={handleDeselect} mode={mode}>
          <Option value="1" testprop="deselect">
            1
          </Option>
          <Option value="2">2</Option>
        </Select>,
      );
      removeSelection(wrapper);

      expect(handleDeselect).toBeCalledWith(
        '1',
        expect.objectContaining({ value: '1', testprop: 'deselect' }),
      );
      expect(handleChange).toBeCalledWith(['2'], expect.anything());
    });

    it('noop if select is disabled', () => {
      const handleDeselect = jest.fn();
      const handleChange = jest.fn();
      const wrapper = mount(
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

      expect(wrapper.find('.rc-select-selection-item-remove')).toHaveLength(0);
    });

    it('wrap value when labelInValue', () => {
      const handleDeselect = jest.fn();
      const handleChange = jest.fn();
      const wrapper = mount(
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
      removeSelection(wrapper);

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
      const wrapper = mount(
        <Select defaultValue={['1', '2']} mode={mode} onChange={onChange}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      );

      wrapper.find('input').simulate('keyDown', { which: KeyCode.BACKSPACE });
      expect(onChange).toHaveBeenCalledWith(['1'], [expect.objectContaining({ value: '1' })]);
    });

    it('remove by menu deselect', () => {
      const onChange = jest.fn();
      const wrapper = mount(
        <Select defaultValue={['1']} mode={mode} onChange={onChange}>
          <Option value="1">1</Option>
        </Select>,
      );

      toggleOpen(wrapper);
      selectItem(wrapper);

      expect(wrapper.find('input').props().value).toBe('');
      expect(onChange).toHaveBeenCalledWith([], []);
    });
  });
}
