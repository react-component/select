/* eslint-disable no-undef, react/no-multi-comp */
import React from 'react';
import { mount, render } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import Select, { Option } from '../src';
import allowClearTest from './shared/allowClearTest';
import throwOptionValue from './shared/throwOptionValue';
import focusTest from './shared/focusTest';
import keyDownTest from './shared/keyDownTest';

describe('Select.combobox', () => {
  allowClearTest('combobox');
  throwOptionValue('combobox');
  focusTest('combobox');
  keyDownTest('combobox');

  it('renders correctly', () => {
    const wrapper = render(
      <Select combobox placeholder="Search">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('set inputValue based on value', () => {
    const wrapper = mount(
      <Select combobox value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    expect(wrapper.state().inputValue).toBe('1');
  });

  it('placeholder', () => {
    const wrapper = mount(
      <Select combobox placeholder="placeholder">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    expect(wrapper.state().inputValue).toBe('');
    expect(
      wrapper.find('.rc-select-selection__placeholder').text()
    ).toBe('placeholder');
    expect(
      wrapper.find('.rc-select-selection__placeholder').prop('style')
    ).toHaveProperty('display', 'block');
    wrapper.find('input').simulate('change', { target: { value: '1' } });
    expect(
      wrapper.update().find('.rc-select-selection__placeholder').prop('style')
    ).toHaveProperty('display', 'none');
    expect(wrapper.state().inputValue).toBe('1');
  });

  it('fire change event immediately when user inputing', () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      <Select combobox onChange={handleChange}>
        <Option value="11">11</Option>
        <Option value="22">22</Option>
      </Select>
    );

    wrapper.find('input').simulate('change', { target: { value: '1' } });

    expect(handleChange).toBeCalledWith('1', <Option key="1" value="1">1</Option>);
  });

  it('set inputValue when user select a option', () => {
    const wrapper = mount(
      <Select combobox>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    wrapper.find('.rc-select').simulate('click');
    wrapper.find('MenuItem').first().simulate('click');
    expect(wrapper.state().inputValue).toBe('1');
  });

  describe('input value', () => {
    const createSelect = (props) => mount(
      <Select
        combobox
        optionLabelProp="children"
        {...props}
      >
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>
    );

    describe('labelInValue is false', () => {
      it('displays correct input value for defaultValue', () => {
        const wrapper = createSelect({
          defaultValue: '1',
        });
        expect(wrapper.find('input').props().value).toBe('One');
      });

      it('displays correct input value for value', () => {
        const wrapper = createSelect({
          value: '1',
        });
        expect(wrapper.find('input').props().value).toBe('One');
      });
    });

    describe('labelInValue is true', () => {
      it('displays correct input value for defaultValue', () => {
        const wrapper = createSelect({
          labelInValue: true,
          defaultValue: { key: '1', label: 'One' },
        });
        expect(wrapper.find('input').props().value).toBe('One');
      });

      it('displays correct input value for value', () => {
        const wrapper = createSelect({
          labelInValue: true,
          value: { key: '1', label: 'One' },
        });
        expect(wrapper.find('input').props().value).toBe('One');
      });

      it('displays correct input value when value changes', () => {
        const wrapper = createSelect({
          labelInValue: true,
          value: { key: '' },
        });
        wrapper.setProps({ value: { key: '1', label: 'One' } });
        expect(wrapper.find('input').props().value).toBe('One');
      });
    });

    describe('hidden when filtered options is empty', () => {
      // https://github.com/ant-design/ant-design/issues/3958
      it('should popup when input with async data', () => {
        jest.useFakeTimers();
        class AsyncCombobox extends React.Component {
          state = {
            data: [],
          }
          handleChange = () => {
            setTimeout(() => {
              this.setState({
                data: [{ key: '1', label: '1' }, { key: '2', label: '2' }],
              });
            }, 500);
          }
          render() {
            const options = this.state.data.map(item => (
              <Option key={item.key}>{item.label}</Option>
            ));
            return (
              <Select
                combobox
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
        expect(wrapper.find('.rc-select-dropdown').hostNodes()
          .hasClass('rc-select-dropdown-hidden')).toBe(false);
      });

      // https://github.com/ant-design/ant-design/issues/6600
      it('should not repop menu after select', () => {
        jest.useFakeTimers();
        class AsyncCombobox extends React.Component {
          state = {
            data: [{ key: '1', label: '1' }, { key: '2', label: '2' }],
          }
          onSelect = () => {
            setTimeout(() => {
              this.setState({
                data: [{ key: '3', label: '3' }, { key: '4', label: '4' }],
              });
            }, 500);
          }
          render() {
            const options = this.state.data.map(item => (
              <Option key={item.key}>{item.label}</Option>
            ));
            return (
              <Select
                combobox
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
        expect(wrapper.find('.rc-select-dropdown').hostNodes()
          .hasClass('rc-select-dropdown-hidden')).toBe(false);
        wrapper.find('MenuItem').first().simulate('click');
        jest.runAllTimers();
        expect(wrapper.find('.rc-select-dropdown').hostNodes()
          .hasClass('rc-select-dropdown-hidden')).toBe(true);
      });
    });
  });

  it('backfill', () => {
    const handleChange = jest.fn();
    const handleSelect = jest.fn();
    const wrapper = mount(
      <Select
        combobox
        backfill
        open
        onChange={handleChange}
        onSelect={handleSelect}
      >
        <Option value="One">One</Option>
        <Option value="Two">Two</Option>
      </Select>
    );

    const input = wrapper.find('input');

    input.simulate('keyDown', { keyCode: KeyCode.DOWN });

    expect(wrapper.state().value).toEqual(['Two']);
    expect(wrapper.state().backfillValue).toEqual('Two');
    expect(wrapper.state().inputValue).toBe('Two');
    expect(wrapper.find('MenuItem').at(1).text()).toBe('Two');
    expect(handleChange).not.toBeCalled();
    expect(handleSelect).not.toBeCalled();

    input.simulate('keyDown', { keyCode: KeyCode.ENTER });

    expect(wrapper.state().value).toEqual(['Two']);
    expect(handleChange).toBeCalledWith('Two', <Option value="Two">Two</Option>);
    expect(handleSelect).toBeCalledWith('Two', <Option value="Two">Two</Option>);
  });

  it('should hide clear icon when value is \'\'', () => {
    const wrapper = mount(
      <Select combobox value="" allowClear>
        <Option value="One">One</Option>
        <Option value="Two">Two</Option>
      </Select>
    );

    expect(wrapper.find('.rc-select-selection__clear').length).toBe(0);
  });

  it('should show clear icon when inputValue is not \'\'', () => {
    const wrapper = mount(
      <Select combobox value="One" allowClear>
        <Option value="One">One</Option>
        <Option value="Two">Two</Option>
      </Select>
    );

    expect(wrapper.find('.rc-select-selection__clear').length).toBe(1);
  });

  it('should hide clear icon when inputValue is \'\'', () => {
    const wrapper = mount(
      <Select combobox allowClear>
        <Option value="One">One</Option>
        <Option value="Two">Two</Option>
      </Select>
    );

    wrapper.find('input').simulate('change', { target: { value: '1' } });
    expect(wrapper.find('.rc-select-selection__clear').length).toBe(1);
    wrapper.find('input').simulate('change', { target: { value: '' } });
    expect(wrapper.find('.rc-select-selection__clear').length).toBe(0);
  });

  it('autocomplete - option update when input change', () => {
    class App extends React.Component {
      state = {
        options: [],
      }

      updateOptions = (value) => {
        const options = [
          value,
          value + value,
          value + value + value,
        ];
        this.setState({
          options,
        });
      }

      render() {
        return (
          <Select
            combobox
            optionLabelProp="children"
            onChange={this.updateOptions}
          >
            {this.state.options.map((opt) => {
              return <Option key={opt}>{opt}</Option>;
            })}
          </Select>
        );
      }
    }

    const wrapper = mount(<App/>);
    wrapper.find('input').simulate('change', { target: { value: 'a' } });
    wrapper.find('input').simulate('change', { target: { value: 'ab' } });
    expect(wrapper.find('input').prop('value')).toBe('ab');
    wrapper.find('MenuItem').at(1).simulate('click');
    expect(wrapper.find('input').prop('value')).toBe('abab');
  });
});
