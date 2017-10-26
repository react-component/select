/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import Select from '../../src/Select';
import Option from '../../src/Option';

export default function removeSelectedTest(mode) {
  describe('remove selected options', () => {
    it('fires deselect and change', () => {
      const handleDeselect = jest.fn();
      const handleChange = jest.fn();
      const wrapper = mount(
        <Select
          value={['1', '2']}
          onChange={handleChange}
          onDeselect={handleDeselect}
          {...{ [mode]: true }}
        >
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
      );
      wrapper.find('.rc-select-selection__choice__remove').first().simulate('click');

      expect(handleDeselect).toBeCalledWith('1');
      expect(handleChange).toBeCalledWith(['2']);
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
          {...{ [mode]: true }}
        >
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
      );
      wrapper.find('.rc-select-selection__choice__remove').first().simulate('click');

      expect(handleDeselect).not.toHaveBeenCalled();
      expect(handleChange).not.toHaveBeenCalled();
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
          {...{ [mode]: true }}
        >
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
      );
      wrapper.find('.rc-select-selection__choice__remove').first().simulate('click');

      expect(handleDeselect).toHaveBeenCalledWith({ key: '1', label: '1' });
      expect(handleChange).toHaveBeenCalledWith([{ key: '2', label: '2' }]);
    });

    it('remove by backspace key', () => {
      const wrapper = mount(
        <Select
          defaultValue={['1', '2']}
          {...{ [mode]: true }}
        >
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
      );

      wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.BACKSPACE });
      expect(wrapper.state().value).toEqual([{ key: '1', label: '1', title: undefined }]);
    });

    it('remove by menu deselect', () => {
      const wrapper = mount(
        <Select
          defaultValue={['1']}
          {...{ [mode]: true }}
        >
          <Option value="1">1</Option>
        </Select>
      );

      wrapper.find('.rc-select').simulate('click');
      wrapper.find('MenuItem').simulate('click');

      expect(wrapper.state().inputValue).toBe('');
      expect(wrapper.state().value).toEqual([]);
    });
  });
}
