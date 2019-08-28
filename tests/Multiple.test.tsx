import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import React from 'react';
import { resetWarned } from 'rc-util/lib/warning';
import Select, { Option, OptGroup } from '../src';
import focusTest from './shared/focusTest';
import blurTest from './shared/blurTest';
import hoverTest from './shared/hoverTest';
import renderTest from './shared/renderTest';
import removeSelectedTest from './shared/removeSelectedTest';
import dynamicChildrenTest from './shared/dynamicChildrenTest';
import inputFilterTest from './shared/inputFilterTest';
import keyDownTest from './shared/keyDownTest';
import openControlledTest from './shared/openControlledTest';
import {
  expectOpen,
  toggleOpen,
  selectItem,
  injectRunAllTimers,
  findSelection,
  removeSelection,
} from './utils/common';
import allowClearTest from './shared/allowClearTest';
import throwOptionValue from './shared/throwOptionValue';

describe('Select.Multiple', () => {
  injectRunAllTimers(jest);

  allowClearTest('multiple', ['903']);
  focusTest('multiple');
  blurTest('multiple');
  hoverTest('multiple');
  renderTest('multiple');
  removeSelectedTest('multiple');
  dynamicChildrenTest('multiple');
  inputFilterTest('multiple');

  it('tokenize input', () => {
    const handleChange = jest.fn();
    const handleSelect = jest.fn();
    const wrapper = mount(
      <Select
        mode="multiple"
        optionLabelProp="children"
        tokenSeparators={[',']}
        onChange={handleChange}
        onSelect={handleSelect}
      >
        <OptGroup key="group1">
          <Option value="1">One</Option>
        </OptGroup>
        <OptGroup key="group2">
          <Option value="2">Two</Option>
        </OptGroup>
      </Select>,
    );

    wrapper.find('input').simulate('change', {
      target: {
        value: 'One',
      },
    });
    expect(handleChange).not.toHaveBeenCalled();

    handleChange.mockReset();
    wrapper.find('input').simulate('change', {
      target: {
        value: 'One,Two,Three',
      },
    });
    expect(handleChange).toHaveBeenCalledWith(['1', '2'], expect.anything());

    handleChange.mockReset();
    wrapper.find('input').simulate('change', {
      target: {
        value: 'One,Two',
      },
    });
    expect(handleChange).toHaveBeenCalledWith(['1', '2'], expect.anything());

    expect(wrapper.find('input').props().value).toBe('');
    wrapper.update();
    expectOpen(wrapper, false);
  });

  it('focus', () => {
    jest.useFakeTimers();
    const handleFocus = jest.fn();
    const wrapper = mount(
      <Select mode="multiple" onFocus={handleFocus}>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>,
    );
    wrapper.find('input').simulate('focus');
    jest.runAllTimers();
    expect(handleFocus).toBeCalled();
    jest.useRealTimers();
  });

  it('OptGroup without key', () => {
    expect(() => {
      mount(
        <Select mode="multiple" defaultValue={['1']}>
          <OptGroup label="group1">
            <Option value="1">One</Option>
          </OptGroup>
          <OptGroup label="group2">
            <Option value="2">Two</Option>
          </OptGroup>
        </Select>,
      );
    }).not.toThrow();
  });

  it('allow number value', () => {
    const handleChange = jest.fn();

    const wrapper = mount(
      <Select mode="multiple" defaultValue={[1]} onChange={handleChange}>
        <Option value={1}>1</Option>
        <Option value={2} testprop={2}>
          2
        </Option>
      </Select>,
    );

    expect(findSelection(wrapper).text()).toEqual('1');

    toggleOpen(wrapper);
    selectItem(wrapper, 1);

    expect(handleChange).toHaveBeenCalledWith(
      [1, 2],
      [expect.objectContaining({ value: 1 }), expect.objectContaining({ value: 2, testprop: 2 })],
    );
  });

  it('do not open when close button click', () => {
    const wrapper = mount(
      <Select mode="multiple">
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );

    toggleOpen(wrapper);
    selectItem(wrapper, 0);
    selectItem(wrapper, 1);

    toggleOpen(wrapper);
    removeSelection(wrapper);
    expectOpen(wrapper, false);
    expect(wrapper.find('Selector').props().values).toEqual([expect.objectContaining({ value: 2 })]);
  });

  // it('select when item enter', () => {
  //   const wrapper = mount(
  //     <Select mode="multiple">
  //       <Option value={1}>1</Option>
  //       <Option value={2}>2</Option>
  //     </Select>,
  //   );
  //   wrapper.find('.rc-select-selection').simulate('click');
  //   const meunItem = wrapper.find('.rc-select-dropdown-menu-item').at(1);
  //   // add active to meunItem
  //   meunItem
  //     .simulate('mouseenter')
  //     .simulate('mouseover')
  //     .simulate('keyDown', { keyCode: 13 });
  //   expect(wrapper.state('open')).toBe(true);
  //   expect(wrapper.state('value')).toEqual([2]);
  //   wrapper.unmount();
  // });

  // it('enter twice to cancel the selection', () => {
  //   const wrapper = mount(
  //     <Select mode="multiple">
  //       <Option value={1}>1</Option>
  //       <Option value={2}>2</Option>
  //     </Select>,
  //   );
  //   wrapper.find('.rc-select-selection').simulate('click');
  //   const meunItem = wrapper.find('.rc-select-dropdown-menu-item').at(1);
  //   // add active to meunItem
  //   meunItem
  //     .simulate('mouseenter')
  //     .simulate('mouseover')
  //     .simulate('keyDown', { keyCode: 13 });
  //   meunItem
  //     .simulate('mouseenter')
  //     .simulate('mouseover')
  //     .simulate('keyDown', { keyCode: 13 });
  //   expect(wrapper.state('open')).toBe(true);
  //   expect(wrapper.state('value')).toEqual([]);
  // });

  // it('do not crash when children has empty', () => {
  //   const wrapper = mount(
  //     <Select mode="multiple">
  //       {null}
  //       <Option value={1}>1</Option>
  //       <Option value={2}>2</Option>
  //     </Select>,
  //   );

  //   wrapper.find('.rc-select-selection').simulate('click');
  //   wrapper
  //     .find('.rc-select-dropdown-menu-item')
  //     .at(0)
  //     .simulate('click');

  //   // Do not crash
  // });

  // it('do not crash when value has empty string', () => {
  //   const wrapper = mount(
  //     <Select mode="multiple" value={['']}>
  //       <Option value={1}>1</Option>
  //       <Option value={2}>2</Option>
  //     </Select>,
  //   );

  //   expect(wrapper.find('.rc-select-selection__choice__content').length).toBe(1);
  // });

  // it('show arrow on multiple mode when explicitly set', () => {
  //   // multiple=true arrow don't have
  //   const wrapper = mount(
  //     <Select mode="multiple" value={['']}>
  //       <Option value={1}>1</Option>
  //       <Option value={2}>2</Option>
  //     </Select>,
  //   );

  //   expect(wrapper.find('.rc-select-arrow-icon').length).toBe(0);

  //   // multiple=true showArrow=true  arrow do have
  //   wrapper.setProps({
  //     showArrow: true,
  //   });
  //   expect(wrapper.find('.rc-select-arrow-icon').length).toBe(1);
  // });
});
