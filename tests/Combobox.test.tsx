import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import React from 'react';
import { resetWarned } from 'rc-util/lib/warning';
import Select, { Option, SelectProps } from '../src';
import focusTest from './shared/focusTest';
import keyDownTest from './shared/keyDownTest';
import openControlledTest from './shared/openControlledTest';
import { expectOpen, toggleOpen, selectItem, injectRunAllTimers } from './utils/common';
import allowClearTest from './shared/allowClearTest';
import throwOptionValue from './shared/throwOptionValue';

describe('Select.Combobox', () => {
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
    expect(wrapper.find('.rc-select-selection-placeholder').text()).toEqual('placeholder');
    wrapper.find('input').simulate('change', { target: { value: '1' } });
    expect(wrapper.find('.rc-select-selection-placeholder').length).toBeFalsy();
    expect(wrapper.find('input').props().value).toBe('1');
  });

  it('fire change event immediately when user inputing', () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      <Select mode="combobox" onChange={handleChange}>
        <Option value="11">11</Option>
        <Option value="22">22</Option>
      </Select>,
    );

    wrapper.find('input').simulate('change', { target: { value: '1' } });
    expect(handleChange).toHaveBeenCalledWith('1', {});

    wrapper.find('input').simulate('change', { target: { value: '22' } });
    expect(handleChange).toHaveBeenCalledWith(
      '22',
      expect.objectContaining({
        children: '22',
        value: '22',
      }),
    );
  });

  it('set inputValue when user select a option', () => {
    const wrapper = mount(
      <Select mode="combobox">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    toggleOpen(wrapper);
    selectItem(wrapper);
    expect(wrapper.find('input').props().value).toEqual('1');
  });

  describe('input value', () => {
    const createSelect = (props?: Partial<SelectProps>) =>
      mount(
        <Select mode="combobox" {...props}>
          <Option value="1">One</Option>
          <Option value="2">Two</Option>
        </Select>,
      );

    it('displays correct input value for defaultValue', () => {
      const wrapper = createSelect({
        defaultValue: '1',
      });
      expect(wrapper.find('input').props().value).toBe('1');
    });

    it('displays correct input value for value', () => {
      const wrapper = createSelect({
        value: '1',
      });
      expect(wrapper.find('input').props().value).toBe('1');
    });

    it('displays correct input value when value changes', () => {
      const wrapper = createSelect();
      wrapper.setProps({ value: '1' });
      expect(wrapper.find('input').props().value).toBe('1');
    });
  });

  describe('hidden when filtered options is empty', () => {
    // https://github.com/ant-design/ant-design/issues/3958
    it('should popup when input with async data', () => {
      jest.useFakeTimers();
      class AsyncCombobox extends React.Component {
        public state = {
          data: [],
        };

        public handleChange = () => {
          setTimeout(() => {
            this.setState({
              data: [{ key: '1', label: '1' }, { key: '2', label: '2' }],
            });
          }, 500);
        };

        public render() {
          const options = this.state.data.map(item => <Option key={item.key}>{item.label}</Option>);
          return (
            <Select
              mode="combobox"
              onChange={this.handleChange}
              filterOption={false}
              notFoundContent=""
            >
              {options}
            </Select>
          );
        }
      }
      const wrapper = mount(<AsyncCombobox />);
      wrapper.find('input').simulate('focus');
      wrapper.find('input').simulate('change', { target: { value: '0' } });
      jest.runAllTimers();
      wrapper.update();
      expectOpen(wrapper);
      jest.useRealTimers();
    });

    // https://github.com/ant-design/ant-design/issues/6600
    it('should not re-open after select', () => {
      jest.useFakeTimers();
      class AsyncCombobox extends React.Component {
        public state = {
          data: [{ key: '1', label: '1' }, { key: '2', label: '2' }],
        };

        public onSelect = () => {
          setTimeout(() => {
            this.setState({
              data: [{ key: '3', label: '3' }, { key: '4', label: '4' }],
            });
          }, 500);
        };

        public render() {
          const options = this.state.data.map(item => <Option key={item.key}>{item.label}</Option>);
          return (
            <Select
              mode="combobox"
              onSelect={this.onSelect}
              filterOption={false}
              notFoundContent=""
            >
              {options}
            </Select>
          );
        }
      }
      const wrapper = mount(<AsyncCombobox />);
      wrapper.find('input').simulate('focus');
      wrapper.find('input').simulate('change', { target: { value: '0' } });
      expectOpen(wrapper);

      selectItem(wrapper);
      jest.runAllTimers();
      expectOpen(wrapper, false);
      jest.useRealTimers();
    });
  });

  it('backfill', () => {
    const handleChange = jest.fn();
    const handleSelect = jest.fn();
    const wrapper = mount(
      <Select mode="combobox" backfill open onChange={handleChange} onSelect={handleSelect}>
        <Option value="One">One</Option>
        <Option value="Two">Two</Option>
      </Select>,
    );
    const input = wrapper.find('input');
    input.simulate('keyDown', { which: KeyCode.DOWN });
    expect(wrapper.find('input').props().value).toEqual('One');
    expect(handleChange).not.toHaveBeenCalled();
    expect(handleSelect).not.toHaveBeenCalled();

    input.simulate('keyDown', { which: KeyCode.ENTER });
    expect(wrapper.find('input').props().value).toEqual('One');
    expect(handleChange).toHaveBeenCalledWith('One', expect.objectContaining({ value: 'One' }));
    expect(handleSelect).toHaveBeenCalledWith('One', expect.objectContaining({ value: 'One' }));
  });

  it("should hide clear icon when value is ''", () => {
    const wrapper = mount(
      <Select mode="combobox" value="" allowClear>
        <Option value="One">One</Option>
        <Option value="Two">Two</Option>
      </Select>,
    );

    expect(wrapper.find('.rc-select-clear-icon').length).toBeFalsy();
  });

  it("should show clear icon when inputValue is not ''", () => {
    const wrapper = mount(
      <Select mode="combobox" value="One" allowClear>
        <Option value="One">One</Option>
        <Option value="Two">Two</Option>
      </Select>,
    );

    expect(wrapper.find('.rc-select-clear-icon').length).toBeTruthy();
  });

  it("should hide clear icon when inputValue is ''", () => {
    const wrapper = mount(
      <Select mode="combobox" allowClear>
        <Option value="One">One</Option>
        <Option value="Two">Two</Option>
      </Select>,
    );

    wrapper.find('input').simulate('change', { target: { value: '1' } });
    expect(wrapper.find('.rc-select-clear-icon').length).toBeTruthy();
    wrapper.find('input').simulate('change', { target: { value: '' } });
    expect(wrapper.find('.rc-select-clear-icon').length).toBeFalsy();
  });

  it('autocomplete - option update when input change', () => {
    class App extends React.Component {
      public state = {
        options: [],
      };

      public updateOptions = value => {
        const options = [value, value + value, value + value + value];
        this.setState({
          options,
        });
      };

      public render() {
        return (
          <Select mode="combobox" onChange={this.updateOptions}>
            {this.state.options.map(opt => (
              <Option key={opt}>{opt}</Option>
            ))}
          </Select>
        );
      }
    }

    const wrapper = mount(<App />);
    wrapper.find('input').simulate('change', { target: { value: 'a' } });
    wrapper.find('input').simulate('change', { target: { value: 'ab' } });
    expect(wrapper.find('input').props().value).toBe('ab');
    selectItem(wrapper, 1);
    expect(wrapper.find('input').prop('value')).toBe('abab');
  });

  // [Legacy] `optionLabelProp` should not work on `combobox`
  // https://github.com/ant-design/ant-design/issues/10367
  // origin test: https://github.com/react-component/select/blob/e5fa4959336f6a423b6e30652b9047510bb6f78f/tests/Select.combobox.spec.tsx#L362
  it('should  autocomplete with correct option value', () => {
    resetWarned();

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount(<Select mode="combobox" optionLabelProp="children" />);
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `combobox` mode not support `optionLabelProp`. Please set `value` on Option directly.',
    );
    errorSpy.mockRestore();
  });

  // https://github.com/ant-design/ant-design/issues/16572
  it('close when enter press without active option', () => {
    jest.useFakeTimers();
    const onDropdownVisibleChange = jest.fn();
    const wrapper = mount(
      <Select mode="combobox" open onDropdownVisibleChange={onDropdownVisibleChange}>
        <Option value="One">One</Option>
        <Option value="Two">Two</Option>
      </Select>,
    );
    wrapper.find('input').simulate('keyDown', {
      which: KeyCode.ENTER,
    });
    jest.runAllTimers();
    wrapper.update();
    expect(onDropdownVisibleChange).toHaveBeenCalledWith(false);
    jest.useRealTimers();
  });
});
