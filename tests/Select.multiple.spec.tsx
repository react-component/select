import { mount } from 'enzyme';
import * as React from 'react';
import Select, { OptGroup, Option } from '../src';
import allowClearTest from './shared/allowClearTest';
import blurTest from './shared/blurTest';
import dynamicChildrenTest from './shared/dynamicChildrenTest';
import focusTest from './shared/focusTest';
import hoverTest from './shared/hoverTest';
import inputFilterTest from './shared/inputFilterTest';
import removeSelectedTest from './shared/removeSelectedTest';
import renderTest from './shared/renderTest';

describe('Select.multiple', () => {
  allowClearTest('multiple');
  focusTest('multiple', {});
  blurTest('multiple');
  hoverTest('multiple');
  renderTest('multiple');
  removeSelectedTest('multiple');
  dynamicChildrenTest('multiple', {});
  inputFilterTest('multiple');

  it('tokenize input', () => {
    const handleChange = jest.fn();
    const handleSelect = jest.fn();
    const wrapper = mount<Select>(
      <Select
        multiple={true}
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

    const input = wrapper.find('input');
    (input.instance() as any).focus = jest.fn();

    input.simulate('change', {
      target: {
        value: 'One',
      },
    });

    input.simulate('change', {
      target: {
        value: 'One,Two,Three',
      },
    });

    input.simulate('change', {
      target: {
        value: 'One,Two',
      },
    });

    expect(handleChange).toBeCalledWith(['1', '2'], expect.anything());
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledTimes(2);
    expect(wrapper.state().value).toEqual(['1', '2']);
    expect(
      wrapper
        .find('.rc-select-selection__choice__content')
        .at(0)
        .text(),
    ).toEqual('One');
    expect(
      wrapper
        .find('.rc-select-selection__choice__content')
        .at(1)
        .text(),
    ).toEqual('Two');
    expect(wrapper.state().inputValue).toBe('');
    expect(wrapper.state().open).toBe(false);
    expect((input.instance() as any).focus).toBeCalled();
  });

  it('focus', () => {
    const handleFocus = jest.fn();
    const wrapper = mount(
      <Select multiple={true} onFocus={handleFocus}>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>,
    );
    jest.useFakeTimers();
    wrapper.find('.rc-select').simulate('focus');
    jest.runAllTimers();
    expect(handleFocus).toBeCalled();
  });

  it('OptGroup without key', () => {
    expect(() => {
      mount(
        <Select multiple={true} defaultValue={['1']}>
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
      <Select multiple={true} defaultValue={1} onChange={handleChange}>
        <Option value={1}>1</Option>
        <Option value={2} testprop={2}>
          2
        </Option>
      </Select>,
    );

    expect(wrapper.find('.rc-select-selection__choice__content').text()).toBe('1');

    wrapper.find('.rc-select').simulate('click');
    wrapper
      .find('MenuItem')
      .at(1)
      .simulate('click');

    const args = handleChange.mock.calls[0];
    expect(args[0]).toEqual([1, 2]);
    expect(args[1].length).toBe(2);

    // magic code
    // expect(handleChange).toBeCalledWith(
    //   [1, 2],
    //   [
    //     <Option key="1" value={1}>
    //       1
    //     </Option>,
    //     <Option value={2} key="2" testprop={2}>
    //       2
    //     </Option>,
    //   ],
    // );

    expect(
      wrapper
        .find('.rc-select-selection__choice__content')
        .at(1)
        .text(),
    ).toBe('2');
  });

  it('do not open when close button click', () => {
    const wrapper = mount(
      <Select multiple={true}>
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );
    wrapper.find('.rc-select-selection').simulate('click');
    wrapper
      .find('.rc-select-dropdown-menu-item')
      .at(0)
      .simulate('click');
    wrapper
      .find('.rc-select-dropdown-menu-item')
      .at(1)
      .simulate('click');
    wrapper.setState({ open: false });
    wrapper
      .find('.rc-select-selection__choice__remove')
      .at(0)
      .simulate('click');
    expect(wrapper.state('open')).toBe(false);
    expect(wrapper.state('value')).toEqual([2]);
  });

  it('select when item enter', () => {
    const wrapper = mount(
      <Select multiple={true}>
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );
    wrapper.find('.rc-select-selection').simulate('click');
    const meunItem = wrapper.find('.rc-select-dropdown-menu-item').at(1);
    // add active to meunItem
    meunItem
      .simulate('mouseenter')
      .simulate('mouseover')
      .simulate('keyDown', { keyCode: 13 });
    expect(wrapper.state('open')).toBe(true);
    expect(wrapper.state('value')).toEqual([2]);
    wrapper.unmount();
  });

  it('enter twice to cancel the selection', () => {
    const wrapper = mount(
      <Select multiple={true}>
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );
    wrapper.find('.rc-select-selection').simulate('click');
    const meunItem = wrapper.find('.rc-select-dropdown-menu-item').at(1);
    // add active to meunItem
    meunItem
      .simulate('mouseenter')
      .simulate('mouseover')
      .simulate('keyDown', { keyCode: 13 });
    meunItem
      .simulate('mouseenter')
      .simulate('mouseover')
      .simulate('keyDown', { keyCode: 13 });
    expect(wrapper.state('open')).toBe(true);
    expect(wrapper.state('value')).toEqual([]);
  });

  it('do not crash when children has empty', () => {
    const wrapper = mount(
      <Select multiple={true}>
        {null}
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );

    wrapper.find('.rc-select-selection').simulate('click');
    wrapper
      .find('.rc-select-dropdown-menu-item')
      .at(0)
      .simulate('click');

    // Do not crash
  });

  it('do not crash when value has empty string', () => {
    const wrapper = mount(
      <Select multiple={true} value={['']}>
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );

    expect(wrapper.find('.rc-select-selection__choice__content').length).toBe(1);
  });

  it('show arrow on multiple mode when explicitly set', () => {
    // multiple=true arrow don't have
    const wrapper = mount(
      <Select multiple={true} value={['']}>
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );

    expect(wrapper.find('.rc-select-arrow-icon').length).toBe(0);

    // multiple=true showArrow=true  arrow do have
    wrapper.setProps({
      showArrow: true,
    });
    expect(wrapper.find('.rc-select-arrow-icon').length).toBe(1);
  });
});
