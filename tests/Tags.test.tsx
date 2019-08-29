import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import * as React from 'react';
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
import { injectRunAllTimers, findSelection, expectOpen } from './utils/common';

describe('Select.Tags', () => {
  injectRunAllTimers(jest);

  allowClearTest('tags', ['1128']);
  focusTest('tags', {});
  blurTest('tags');
  hoverTest('tags');
  renderTest('tags');
  removeSelectedTest('tags');
  throwOptionValue('tags');
  dynamicChildrenTest('tags', {});
  inputFilterTest('tags');
  openControlledTest('tags');

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('allow user input tags', () => {
    const wrapper = mount(<Select mode="tags" />);

    wrapper
      .find('input')
      .simulate('change', { target: { value: 'foo' } })
      .simulate('keyDown', { which: KeyCode.ENTER });

    expect(findSelection(wrapper).text()).toBe('foo');
  });

  it('should call onChange on blur', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Select mode="tags" onChange={onChange} />);

    wrapper
      .find('input')
      .simulate('change', { target: { value: 'foo' } })
      .simulate('blur');

    jest.runAllTimers();
    expect(findSelection(wrapper).text()).toBe('foo');
    expect(onChange).toHaveBeenCalledWith(['foo'], [undefined]);
  });

  it('tokenize input', () => {
    const handleChange = jest.fn();
    const handleSelect = jest.fn();
    const option2 = <Option value="2">2</Option>;
    const wrapper = mount(
      <Select mode="tags" tokenSeparators={[',']} onChange={handleChange} onSelect={handleSelect}>
        <Option value="1">1</Option>
        {option2}
      </Select>,
    );

    wrapper.find('input').instance().focus = jest.fn();

    wrapper.find('input').simulate('change', { target: { value: '2,3,4' } });

    expect(handleChange).toBeCalledWith(['2', '3', '4'], expect.anything());
    expect(handleSelect).toHaveBeenCalledTimes(3);
    expect(handleSelect).toHaveBeenLastCalledWith('4', undefined);
    expect(findSelection(wrapper).text()).toEqual('2');
    expect(findSelection(wrapper, 1).text()).toEqual('3');
    expect(findSelection(wrapper, 2).text()).toEqual('4');
    expect(wrapper.find('input').props().value).toBe('');
    expectOpen(wrapper, false);
  });

  it('renders unlisted item in value', () => {
    const wrapper = mount(
      <Select mode="tags" value="3" open>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(wrapper.find('List').props().data).toHaveLength(3);
  });

  it('dropdown keeps order', () => {
    const wrapper = mount(<Select mode="tags" open value={['aaaaa', 'aaa']} />);

    wrapper.find('input').simulate('change', { target: { value: 'aaa' } });
    expectOpen(wrapper);
    expect(wrapper.find('List').props().data).toEqual([
      expect.objectContaining({ key: 'aaa' }),
      expect.objectContaining({ key: 'aaaaa' }),
    ]);
  });

  // it('renders search value when not found', () => {
  //   const wrapper = render(
  //     <Select mode="tags" value="22" inputValue="2" open={true}>
  //       <Option value="1">1</Option>
  //     </Select>,
  //   );

  //   expect(wrapper).toMatchSnapshot();
  // });

  // it('use filterOption', () => {
  //   const filterOption = (inputValue, option) =>
  //     option.props.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;

  //   const wrapper = render(
  //     <Select mode="tags" inputValue="red" filterOption={filterOption} open={true}>
  //       <Option value="Red">Red</Option>
  //     </Select>,
  //   );

  //   expect(wrapper).toMatchSnapshot();
  // });

  // it('filterOption is false', () => {
  //   const wrapper = mount<Select>(
  //     <Select mode="tags" filterOption={false}>
  //       <Option value="1">1</Option>
  //       <Option value="2">2</Option>
  //     </Select>,
  //   );
  //   // @HACK
  //   const input = wrapper.find('input') as any;
  //   input.instance().focus = jest.fn();
  //   input
  //     .simulate('change', { target: { value: 'a' } })
  //     .simulate('keyDown', { keyCode: KeyCode.ENTER });

  //   expect(wrapper.state().value).toEqual(['a']);
  //   expect(wrapper.find('.rc-select-selection__choice__content').text()).toBe('a');
  // });

  // describe('OptGroup', () => {
  //   const createSelect = props => (
  //     <div>
  //       <Select mode="tags" {...props}>
  //         <OptGroup key="Manager" label="Manager">
  //           <Option key="jack" value="jack">
  //             Jack
  //           </Option>
  //         </OptGroup>
  //         <OptGroup key="Engineer" label="Engineer">
  //           <Option key="Yiminghe" value="Yiminghe">
  //             yiminghe
  //           </Option>
  //         </OptGroup>
  //       </Select>
  //     </div>
  //   );

  //   it('renders correctly', () => {
  //     const wrapper = mount<Select>(createSelect({ value: ['jack', 'foo'] }));
  //     wrapper.find('.rc-select').simulate('click');
  //     expect(wrapper.render()).toMatchSnapshot();
  //   });

  //   it('renders inputValue correctly', () => {
  //     const wrapper = mount<Select>(createSelect({}));
  //     wrapper.find('.rc-select').simulate('click');

  //     wrapper.find('input').simulate('change', { target: { value: 'foo' } });
  //     expect(wrapper.render()).toMatchSnapshot();

  //     wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.ENTER });
  //     expect(wrapper.render()).toMatchSnapshot();
  //   });

  //   it('should work fine when filterOption function exists', () => {
  //     const children = [];
  //     for (let i = 10; i < 36; i++) {
  //       children.push(
  //         <Option key={i.toString(36) + i} disabled={!(i % 3)}>
  //           {i.toString(36) + i}
  //         </Option>,
  //       );
  //     }
  //     const wrapper = mount<Select>(
  //       <Select
  //         mode="tags"
  //         style={{ width: '100%' }}
  //         placeholder="Tags Mode"
  //         filterOption={(input, { key }) => key.indexOf(input) >= 0}
  //       >
  //         {children}
  //       </Select>,
  //     );
  //     wrapper.find('.rc-select').simulate('click');

  //     wrapper.find('input').simulate('change', { target: { value: 'f' } });
  //     expect(wrapper.find('.rc-select-dropdown-menu-item').length).toBe(2);

  //     wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.ENTER });
  //     expect(wrapper.find('.rc-select-selection__choice__content').text()).toEqual('f');
  //   });
  // });
});
