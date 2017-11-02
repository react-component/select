/* eslint-disable no-undef */
import React from 'react';
import { mount, render } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import Select, { Option } from '../src';
import allowClearTest from './shared/allowClearTest';
import focusTest from './shared/focusTest';
import blurTest from './shared/blurTest';
import hoverTest from './shared/hoverTest';
import renderTest from './shared/renderTest';
import removeSelectedTest from './shared/removeSelectedTest';
import throwOptionValue from './shared/throwOptionValue';

describe('Select.tags', () => {
  allowClearTest('tags');
  focusTest('tags');
  blurTest('tags');
  hoverTest('tags');
  renderTest('tags');
  removeSelectedTest('tags');
  throwOptionValue('tags');

  it('allow user input tags', () => {
    const wrapper = mount(
      <Select tags />
    );

    wrapper.find('input')
      .simulate('change', { target: { value: 'foo' } })
      .simulate('keyDown', { keyCode: KeyCode.ENTER });

    expect(wrapper.state().value).toEqual([{ key: 'foo', label: 'foo', title: undefined }]);
  });

  it('tokenize input', () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      <Select
        tags
        tokenSeparators={[',']}
        onChange={handleChange}
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    const input = wrapper.find('input');
    input.instance().focus = jest.fn();

    input.simulate('change', { target: { value: '2,3,4' } });

    expect(handleChange).toBeCalledWith(['2', '3', '4']);
    expect(wrapper.state().value).toEqual([
      { key: '2', label: '2' },
      { key: '3', label: '3' },
      { key: '4', label: '4' },
    ]);
    expect(wrapper.state().inputValue).toBe('');
    expect(wrapper.state().open).toBe(false);
    expect(input.instance().focus).toBeCalled();
  });

  it('renders unlisted item in value', () => {
    const wrapper = render(
      <Select tags value="3" open>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('renders search value when not found', () => {
    const wrapper = render(
      <Select tags value="22" inputValue="2" open>
        <Option value="1">1</Option>
      </Select>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('use filterOption', () => {
    const filterOption = (inputValue, option) =>
      option.props.value
        .toLowerCase()
        .indexOf(inputValue.toLowerCase()) !== -1;

    const wrapper = render(
      <Select tags inputValue="red" filterOption={filterOption} open>
        <Option value="Red">Red</Option>
      </Select>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('filterOption is false', () => {
    const wrapper = mount(
      <Select
        tags
        filterOption={false}
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    const input = wrapper.find('input');
    input.instance().focus = jest.fn();
    input
      .simulate('change', { target: { value: 'a' } })
      .simulate('keyDown', { keyCode: KeyCode.ENTER });

    expect(wrapper.state().value).toEqual([{ key: 'a', label: 'a', title: undefined }]);
  });
});
