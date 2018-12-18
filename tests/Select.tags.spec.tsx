import { mount, render } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import React from 'react';
import Select, { OptGroup, Option } from '../src';
import allowClearTest from './shared/allowClearTest';
import blurTest from './shared/blurTest';
import dynamicChildrenTest from './shared/dynamicChildrenTest';
import focusTest from './shared/focusTest';
import hoverTest from './shared/hoverTest';
import inputFilterTest from './shared/inputFilterTest';
import openControlledTest from './shared/openControlledTest';
import removeSelectedTest from './shared/removeSelectedTest';
import renderTest from './shared/renderTest';
import throwOptionValue from './shared/throwOptionValue';

describe('Select.tags', () => {
  allowClearTest('tags');
  focusTest('tags', {});
  blurTest('tags');
  hoverTest('tags');
  renderTest('tags');
  removeSelectedTest('tags');
  throwOptionValue('tags');
  dynamicChildrenTest('tags', {});
  inputFilterTest('tags');
  openControlledTest('tags');

  it('allow user input tags', () => {
    const wrapper = mount<Select>(<Select tags={true} />);

    wrapper
      .find('input')
      .simulate('change', { target: { value: 'foo' } })
      .simulate('keyDown', { keyCode: KeyCode.ENTER });

    expect(wrapper.state().value).toEqual(['foo']);
    expect(
      wrapper
        .update()
        .find('.rc-select-selection__choice__content')
        .text(),
    ).toBe('foo');
  });

  it('should call onChange on blur', () => {
    const wrapper = mount<Select>(<Select tags={true} />);

    jest.useFakeTimers();
    wrapper
      .find('input')
      .simulate('change', { target: { value: 'foo' } })
      .simulate('blur');

    jest.runAllTimers();
    expect(wrapper.state().value).toEqual(['foo']);
    expect(
      wrapper
        .update()
        .find('.rc-select-selection__choice__content')
        .text(),
    ).toBe('foo');
  });

  it('tokenize input', () => {
    const handleChange = jest.fn();
    const handleSelect = jest.fn();
    const option2 = <Option value="2">2</Option>;
    const wrapper = mount<Select>(
      <Select tags={true} tokenSeparators={[',']} onChange={handleChange} onSelect={handleSelect}>
        <Option value="1">1</Option>
        {option2}
      </Select>,
    );
    // @HACK
    const input = wrapper.find('input') as any;
    input.instance().focus = jest.fn();

    input.simulate('change', { target: { value: '2,3,4' } });

    expect(handleChange).toBeCalledWith(['2', '3', '4'], expect.anything());
    expect(handleSelect).toHaveBeenCalledTimes(3);
    expect(handleSelect).toHaveBeenLastCalledWith(
      '4',
      <Option key="4" value="4">
        4
      </Option>,
    );
    expect(wrapper.state().value).toEqual(['2', '3', '4']);
    expect(
      wrapper
        .find('.rc-select-selection__choice__content')
        .at(0)
        .text(),
    ).toBe('2');
    expect(
      wrapper
        .find('.rc-select-selection__choice__content')
        .at(1)
        .text(),
    ).toBe('3');
    expect(
      wrapper
        .find('.rc-select-selection__choice__content')
        .at(2)
        .text(),
    ).toBe('4');
    expect(wrapper.state().inputValue).toBe('');
    expect(wrapper.state().open).toBe(false);
    expect(input.instance().focus).toBeCalled();
  });

  it('renders unlisted item in value', () => {
    const wrapper = render(
      <Select tags={true} value="3" open={true}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('renders search value when not found', () => {
    const wrapper = render(
      <Select tags={true} value="22" inputValue="2" open={true}>
        <Option value="1">1</Option>
      </Select>,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('use filterOption', () => {
    const filterOption = (inputValue, option) =>
      option.props.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;

    const wrapper = render(
      <Select tags={true} inputValue="red" filterOption={filterOption} open={true}>
        <Option value="Red">Red</Option>
      </Select>,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('filterOption is false', () => {
    const wrapper = mount<Select>(
      <Select tags={true} filterOption={false}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    // @HACK
    const input = wrapper.find('input') as any;
    input.instance().focus = jest.fn();
    input
      .simulate('change', { target: { value: 'a' } })
      .simulate('keyDown', { keyCode: KeyCode.ENTER });

    expect(wrapper.state().value).toEqual(['a']);
    expect(wrapper.find('.rc-select-selection__choice__content').text()).toBe('a');
  });

  describe('OptGroup', () => {
    const createSelect = props => (
      <div>
        <Select tags={true} {...props}>
          <OptGroup key="Manager" label="Manager">
            <Option key="jack" value="jack">
              Jack
            </Option>
          </OptGroup>
          <OptGroup key="Engineer" label="Engineer">
            <Option key="Yiminghe" value="Yiminghe">
              yiminghe
            </Option>
          </OptGroup>
        </Select>
      </div>
    );

    it('renders correctly', () => {
      const wrapper = mount<Select>(createSelect({ value: ['jack', 'foo'] }));
      wrapper.find('.rc-select').simulate('click');
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('renders inputValue correctly', () => {
      const wrapper = mount<Select>(createSelect({}));
      wrapper.find('.rc-select').simulate('click');

      wrapper.find('input').simulate('change', { target: { value: 'foo' } });
      expect(wrapper.render()).toMatchSnapshot();

      wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.ENTER });
      expect(wrapper.render()).toMatchSnapshot();
    });
  });
});
