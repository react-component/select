import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { resetWarned } from 'rc-util/lib/warning';
import Select, { OptGroup, Option, SelectProps } from '../src';
import focusTest from './shared/focusTest';
import blurTest from './shared/blurTest';
import keyDownTest from './shared/keyDownTest';
import inputFilterTest from './shared/inputFilterTest';
import openControlledTest from './shared/openControlledTest';
import {
  expectOpen,
  toggleOpen,
  selectItem,
  findSelection,
  injectRunAllTimers,
} from './utils/common';
import allowClearTest from './shared/allowClearTest';
import throwOptionValue from './shared/throwOptionValue';

describe('Combobox', () => {
  injectRunAllTimers(jest);

  allowClearTest('combobox', '2333');
  throwOptionValue('combobox');
  focusTest('combobox');
  keyDownTest('combobox');
  openControlledTest('combobox');

  it('renders correctly', () => {
    const wrapper = mount(
      <Select mode="combobox" placeholder="Search">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('set inputValue based on value', () => {
    const wrapper = mount(
      <Select mode="combobox" value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(wrapper.find('input').props().value).toEqual('1');
  });

  it('placeholder', () => {
    const wrapper = mount(
      <Select mode="combobox" placeholder="placeholder">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

      expect(wrapper.find('input').props().value).toBe('');
      expect(wrapper.find('.rc-select-selection__placeholder').text()).toBe('placeholder');
    //   expect(wrapper.find('.rc-select-selection__placeholder').prop('style')).toHaveProperty(
    //     'display',
    //     'block',
    //   );
    //   wrapper.find('input').simulate('change', { target: { value: '1' } });
    //   expect(
    //     wrapper
    //       .update()
    //       .find('.rc-select-selection__placeholder')
    //       .prop('style'),
    //   ).toHaveProperty('display', 'none');
    //   expect(wrapper.state().inputValue).toBe('1');
  });

  // it('fire change event immediately when user inputing', () => {
  //   const handleChange = jest.fn();
  //   const wrapper = mount(
  //     <Select mode="combobox" onChange={handleChange}>
  //       <Option value="11">11</Option>
  //       <Option value="22">22</Option>
  //     </Select>,
  //   );

  //   wrapper.find('input').simulate('change', { target: { value: '1' } });

  //   expect(handleChange).toBeCalledWith(
  //     '1',
  //     <Option key="1" value="1">
  //       1
  //     </Option>,
  //   );
  // });

  // it('set inputValue when user select a option', () => {
  //   const wrapper = mount<Select>(
  //     <Select mode="combobox">
  //       <Option value="1">1</Option>
  //       <Option value="2">2</Option>
  //     </Select>,
  //   );

  //   wrapper.find('.rc-select').simulate('click');
  //   wrapper
  //     .find('MenuItem')
  //     .first()
  //     .simulate('click');
  //   expect(wrapper.state().inputValue).toBe('1');
  // });

  // describe('input value', () => {
  //   const createSelect = props =>
  //     mount(
  //       <Select mode="combobox" optionLabelProp="children" {...props}>
  //         <Option value="1">One</Option>
  //         <Option value="2">Two</Option>
  //       </Select>,
  //     );

  //   describe('labelInValue is false', () => {
  //     it('displays correct input value for defaultValue', () => {
  //       const wrapper = createSelect({
  //         defaultValue: '1',
  //       });
  //       expect(wrapper.find('input').props().value).toBe('One');
  //     });

  //     it('displays correct input value for value', () => {
  //       const wrapper = createSelect({
  //         value: '1',
  //       });
  //       expect(wrapper.find('input').props().value).toBe('One');
  //     });
  //   });

  //   describe('labelInValue is true', () => {
  //     it('displays correct input value for defaultValue', () => {
  //       const wrapper = createSelect({
  //         labelInValue: true,
  //         defaultValue: { key: '1', label: 'One' },
  //       });
  //       expect(wrapper.find('input').props().value).toBe('One');
  //     });

  //     it('displays correct input value for value', () => {
  //       const wrapper = createSelect({
  //         labelInValue: true,
  //         value: { key: '1', label: 'One' },
  //       });
  //       expect(wrapper.find('input').props().value).toBe('One');
  //     });

  //     it('displays correct input value when value changes', () => {
  //       const wrapper = createSelect({
  //         labelInValue: true,
  //         value: { key: '' },
  //       });
  //       wrapper.setProps({ value: { key: '1', label: 'One' } });
  //       expect(wrapper.find('input').props().value).toBe('One');
  //     });
  //   });

  //   describe('hidden when filtered options is empty', () => {
  //     // https://github.com/ant-design/ant-design/issues/3958
  //     it('should popup when input with async data', () => {
  //       jest.useFakeTimers();
  //       class AsyncCombobox extends React.Component {
  //         public state = {
  //           data: [],
  //         };
  //         public handleChange = () => {
  //           setTimeout(() => {
  //             this.setState({
  //               data: [{ key: '1', label: '1' }, { key: '2', label: '2' }],
  //             });
  //           }, 500);
  //         };
  //         public render() {
  //           const options = this.state.data.map(item => (
  //             <Option key={item.key}>{item.label}</Option>
  //           ));
  //           return (
  //             <Select
  //               mode="combobox"
  //               onChange={this.handleChange}
  //               filterOption={false}
  //               notFoundContent=""
  //             >
  //               {options}
  //             </Select>
  //           );
  //         }
  //       }
  //       const wrapper = mount(<AsyncCombobox />);
  //       wrapper.find('input').simulate('focus');
  //       wrapper.find('input').simulate('change', { target: { value: '0' } });
  //       jest.runAllTimers();
  //       wrapper.update();
  //       expect(
  //         wrapper
  //           .find('.rc-select-dropdown')
  //           .hostNodes()
  //           .hasClass('rc-select-dropdown-hidden'),
  //       ).toBe(false);
  //     });

  //     // https://github.com/ant-design/ant-design/issues/6600
  //     it('should not repop menu after select', () => {
  //       jest.useFakeTimers();
  //       // tslint:disable-next-line:max-classes-per-file
  //       class AsyncCombobox extends React.Component {
  //         public state = {
  //           data: [{ key: '1', label: '1' }, { key: '2', label: '2' }],
  //         };
  //         public onSelect = () => {
  //           setTimeout(() => {
  //             this.setState({
  //               data: [{ key: '3', label: '3' }, { key: '4', label: '4' }],
  //             });
  //           }, 500);
  //         };
  //         public render() {
  //           const options = this.state.data.map(item => (
  //             <Option key={item.key}>{item.label}</Option>
  //           ));
  //           return (
  //             <Select
  //               mode="combobox"
  //               onSelect={this.onSelect}
  //               filterOption={false}
  //               notFoundContent=""
  //             >
  //               {options}
  //             </Select>
  //           );
  //         }
  //       }
  //       const wrapper = mount(<AsyncCombobox />);
  //       wrapper.find('input').simulate('focus');
  //       wrapper.find('input').simulate('change', { target: { value: '0' } });
  //       expect(
  //         wrapper
  //           .find('.rc-select-dropdown')
  //           .hostNodes()
  //           .hasClass('rc-select-dropdown-hidden'),
  //       ).toBe(false);
  //       wrapper
  //         .find('MenuItem')
  //         .first()
  //         .simulate('click');
  //       jest.runAllTimers();
  //       expect(
  //         wrapper
  //           .find('.rc-select-dropdown')
  //           .hostNodes()
  //           .hasClass('rc-select-dropdown-hidden'),
  //       ).toBe(true);
  //     });
  //   });
  // });

  // it('backfill', () => {
  //   const handleChange = jest.fn();
  //   const handleSelect = jest.fn();
  //   const wrapper = mount<Select>(
  //     <Select
  //       mode="combobox"
  //       backfill={true}
  //       open={true}
  //       onChange={handleChange}
  //       onSelect={handleSelect}
  //     >
  //       <Option value="One">One</Option>
  //       <Option value="Two">Two</Option>
  //     </Select>,
  //   );

  //   const input = wrapper.find('input');

  //   input.simulate('keyDown', { keyCode: KeyCode.DOWN });

  //   expect(wrapper.state().value).toEqual(['Two']);
  //   expect(wrapper.state().backfillValue).toEqual('Two');
  //   expect(wrapper.state().inputValue).toBe('Two');
  //   expect(
  //     wrapper
  //       .find('MenuItem')
  //       .at(1)
  //       .text(),
  //   ).toBe('Two');
  //   expect(handleChange).not.toBeCalled();
  //   expect(handleSelect).not.toBeCalled();

  //   input.simulate('keyDown', { keyCode: KeyCode.ENTER });

  //   expect(wrapper.state().value).toEqual(['Two']);
  //   expect(handleChange).toBeCalledWith('Two', <Option value="Two">Two</Option>);
  //   expect(handleSelect).toBeCalledWith('Two', <Option value="Two">Two</Option>);
  // });

  // it("should hide clear icon when value is ''", () => {
  //   const wrapper = mount(
  //     <Select mode="combobox" value="" allowClear={true}>
  //       <Option value="One">One</Option>
  //       <Option value="Two">Two</Option>
  //     </Select>,
  //   );

  //   expect(wrapper.find('.rc-select-selection__clear').length).toBe(0);
  // });

  // it("should show clear icon when inputValue is not ''", () => {
  //   const wrapper = mount(
  //     <Select mode="combobox" value="One" allowClear={true}>
  //       <Option value="One">One</Option>
  //       <Option value="Two">Two</Option>
  //     </Select>,
  //   );

  //   expect(wrapper.find('.rc-select-selection__clear').length).toBe(1);
  // });

  // it("should hide clear icon when inputValue is ''", () => {
  //   const wrapper = mount(
  //     <Select mode="combobox" allowClear={true}>
  //       <Option value="One">One</Option>
  //       <Option value="Two">Two</Option>
  //     </Select>,
  //   );

  //   wrapper.find('input').simulate('change', { target: { value: '1' } });
  //   expect(wrapper.find('.rc-select-selection__clear').length).toBe(1);
  //   wrapper.find('input').simulate('change', { target: { value: '' } });
  //   expect(wrapper.find('.rc-select-selection__clear').length).toBe(0);
  // });

  // it('autocomplete - option update when input change', () => {
  //   // tslint:disable-next-line:max-classes-per-file
  //   class App extends React.Component {
  //     public state = {
  //       options: [],
  //     };

  //     public updateOptions = value => {
  //       const options = [value, value + value, value + value + value];
  //       this.setState({
  //         options,
  //       });
  //     };

  //     public render() {
  //       return (
  //         <Select mode="combobox" optionLabelProp="children" onChange={this.updateOptions}>
  //           {this.state.options.map(opt => {
  //             return <Option key={opt}>{opt}</Option>;
  //           })}
  //         </Select>
  //       );
  //     }
  //   }

  //   const wrapper = mount(<App />);
  //   wrapper.find('input').simulate('change', { target: { value: 'a' } });
  //   wrapper.find('input').simulate('change', { target: { value: 'ab' } });
  //   expect(wrapper.find('input').prop('value')).toBe('ab');
  //   wrapper
  //     .find('MenuItem')
  //     .at(1)
  //     .simulate('click');
  //   expect(wrapper.find('input').prop('value')).toBe('abab');
  // });

  // // https://github.com/ant-design/ant-design/issues/10367
  // it('should  autocomplete with correct option value', () => {
  //   const wrapper = mount(
  //     <Select mode="combobox" optionLabelProp="children">
  //       {[1, 11, 111, 1111].map(opt => {
  //         return <Option key={opt}>{`xxx-${opt}`}</Option>;
  //       })}
  //     </Select>,
  //   );
  //   wrapper.find('input').simulate('change', { target: { value: '1' } });
  //   wrapper
  //     .find('MenuItem')
  //     .at(0)
  //     .simulate('click');
  //   expect(wrapper.find('input').prop('value')).toBe('xxx-1');
  // });

  // // https://github.com/ant-design/ant-design/issues/16572
  // it('close when enter press without active option', () => {
  //   jest.useFakeTimers();

  //   const onDropdownVisibleChange = jest.fn();

  //   const wrapper = mount<Select>(
  //     <Select mode="combobox" open={true} onDropdownVisibleChange={onDropdownVisibleChange}>
  //       <Option value="One">One</Option>
  //       <Option value="Two">Two</Option>
  //     </Select>,
  //   );

  //   wrapper.find('input').simulate('keyDown', {
  //     keyCode: KeyCode.ENTER,
  //   });

  //   jest.runAllTimers();
  //   wrapper.update();
  //   expect(onDropdownVisibleChange).toBeCalledWith(false);

  //   jest.useRealTimers();
  // });
});
