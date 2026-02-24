/* eslint-disable max-classes-per-file */

import '@testing-library/jest-dom';
import { createEvent, fireEvent, render } from '@testing-library/react';
import KeyCode from '@rc-component/util/lib/KeyCode';
import { resetWarned } from '@rc-component/util/lib/warning';
import React, { act } from 'react';
import type { SelectProps } from '../src';
import Select, { Option } from '../src';
import allowClearTest from './shared/allowClearTest';
import focusTest from './shared/focusTest';
import keyDownTest from './shared/keyDownTest';
import openControlledTest from './shared/openControlledTest';
import throwOptionValue from './shared/throwOptionValue';
import { expectOpen, injectRunAllTimers, keyDown, selectItem, toggleOpen } from './utils/common';

async function delay(timeout = 0) {
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  });
}

describe('Select.Combobox', () => {
  injectRunAllTimers(jest);

  allowClearTest('combobox', '2333');
  throwOptionValue('combobox');
  focusTest('combobox');
  keyDownTest('combobox');
  openControlledTest('combobox');

  it('renders correctly', () => {
    const { container } = render(
      <Select mode="combobox" placeholder="Search">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders controlled correctly', () => {
    const { container } = render(
      <Select value="" mode="combobox" placeholder="Search">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('set inputValue based on value', () => {
    const { container } = render(
      <Select mode="combobox" value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    // expect(wrapper.find('input').props().value).toEqual('1');
    expect(container.querySelector('input').value).toEqual('1');
  });

  it('placeholder', () => {
    const { container } = render(
      <Select mode="combobox" placeholder="placeholder">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(container.querySelector('input').value).toBe('');
    expect(container.querySelector('.rc-select-placeholder')!.textContent).toEqual('placeholder');
    fireEvent.change(container.querySelector('input')!, { target: { value: '1' } });
    expect(container.querySelector('.rc-select-placeholder')).toBeFalsy();
    expect(container.querySelector('input')!.value).toBe('1');
  });

  it('fire change event immediately when user inputing', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <Select mode="combobox" onChange={handleChange}>
        <Option value="11">11</Option>
        <Option value="22">22</Option>
      </Select>,
    );

    fireEvent.change(container.querySelector('input')!, { target: { value: '1' } });
    expect(handleChange).toHaveBeenCalledWith('1', {});

    fireEvent.change(container.querySelector('input')!, { target: { value: '22' } });
    expect(handleChange).toHaveBeenCalledWith(
      '22',
      expect.objectContaining({
        children: '22',
        value: '22',
      }),
    );
  });

  it('set inputValue when user select a option', () => {
    const { container } = render(
      <Select mode="combobox">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    toggleOpen(container);
    selectItem(container);
    expect(container.querySelector('input')).toHaveValue('1');
  });

  describe('input value', () => {
    const createSelect = (props?: Partial<SelectProps>) => (
      <Select mode="combobox" {...props}>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>
    );

    it('displays correct input value for defaultValue', () => {
      const { container } = render(
        createSelect({
          defaultValue: '1',
        }),
      );
      expect(container.querySelector('input')!.value).toBe('1');
    });

    it('displays correct input value for value', () => {
      const { container } = render(
        createSelect({
          value: '1',
        }),
      );
      expect(container.querySelector('input')!.value).toBe('1');
    });

    it('displays correct input value when value changes', () => {
      const { container, rerender } = render(createSelect());
      rerender(createSelect({ value: '1' }));
      expect(container.querySelector('input')!.value).toBe('1');
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
              data: [
                { key: '1', label: '1' },
                { key: '2', label: '2' },
              ],
            });
          }, 500);
        };

        public render() {
          const options = this.state.data.map((item) => (
            <Option key={item.key} value={item.key}>
              {item.label}
            </Option>
          ));
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
      const { container } = render(<AsyncCombobox />);
      fireEvent.focus(container.querySelector('input')!);
      fireEvent.change(container.querySelector('input')!, { target: { value: '0' } });
      jest.runAllTimers();
      expectOpen(container);
      jest.useRealTimers();
    });

    // https://github.com/ant-design/ant-design/issues/6600
    it('should not re-open after select', () => {
      jest.useFakeTimers();
      class AsyncCombobox extends React.Component {
        public state = {
          data: [
            { key: '1', label: '1' },
            { key: '2', label: '2' },
          ],
        };

        public onSelect = () => {
          setTimeout(() => {
            this.setState({
              data: [
                { key: '3', label: '3' },
                { key: '4', label: '4' },
              ],
            });
          }, 500);
        };

        public render() {
          const options = this.state.data.map((item) => (
            <Option key={item.key} value={item.key}>
              {item.label}
            </Option>
          ));
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
      const { container } = render(<AsyncCombobox />);
      fireEvent.focus(container.querySelector('input')!);
      fireEvent.change(container.querySelector('input')!, { target: { value: '0' } });
      expectOpen(container);

      selectItem(container);
      jest.runAllTimers();
      expectOpen(container, false);
      jest.useRealTimers();
    });
  });

  describe('backfill', () => {
    it('basic', () => {
      const handleChange = jest.fn();
      const handleSelect = jest.fn();
      const { container } = render(
        <Select mode="combobox" backfill open onChange={handleChange} onSelect={handleSelect}>
          <Option value="One">One</Option>
          <Option value="Two">Two</Option>
        </Select>,
      );
      const input = container.querySelector('input')!;
      keyDown(input, KeyCode.DOWN);
      expect(input.value).toEqual('One');
      expect(handleChange).not.toHaveBeenCalled();
      expect(handleSelect).not.toHaveBeenCalled();

      keyDown(input, KeyCode.ENTER);
      expect(input.value).toEqual('One');
      expect(handleChange).toHaveBeenCalledWith('One', expect.objectContaining({ value: 'One' }));
      expect(handleSelect).toHaveBeenCalledWith('One', expect.objectContaining({ value: 'One' }));
    });

    it('mouse should not trigger', () => {
      const { container } = render(
        <Select mode="combobox" backfill open>
          <Option value="One">One</Option>
          <Option value="Two">Two</Option>
        </Select>,
      );

      fireEvent.mouseMove(container.querySelector('.rc-select-item-option'));

      expect(container.querySelector('input')!.value).toBeFalsy();
    });

    // https://github.com/ant-design/ant-design/issues/25345
    it('dynamic options', () => {
      const onChange = jest.fn();

      const Test = () => {
        const [options, setOptions] = React.useState([]);
        const onSearch = (value: string) => {
          let res = [];

          if (!value || value.indexOf('@') >= 0) {
            res = [];
          } else {
            const email = `${value}@gmail.com`;
            res = [{ value: email, label: email }];
          }
          setOptions(res);
        };
        return (
          <Select
            backfill
            mode="combobox"
            onChange={onChange}
            onSearch={onSearch}
            options={options}
          />
        );
      };

      const { container } = render(<Test />);

      const inputEle = container.querySelector('input')!;

      fireEvent.change(inputEle, { target: { value: 'light' } });
      expectOpen(container);
      expect(onChange).toHaveBeenCalledWith('light', expect.anything());
      onChange.mockReset();

      keyDown(inputEle, KeyCode.DOWN);
      expect(inputEle).toHaveValue('light@gmail.com');
      expect(onChange).not.toHaveBeenCalled();

      keyDown(inputEle, KeyCode.ENTER);
      expect(onChange).toHaveBeenCalledWith('light@gmail.com', expect.anything());
    });
  });

  it("should hide clear icon when value is ''", () => {
    const { container } = render(
      <Select mode="combobox" value="" allowClear>
        <Option value="One">One</Option>
        <Option value="Two">Two</Option>
      </Select>,
    );

    expect(container.querySelector('.rc-select-clear')).toBeFalsy();
  });

  it("should show clear icon when inputValue is not ''", () => {
    const { container } = render(
      <Select mode="combobox" value="One" allowClear>
        <Option value="One">One</Option>
        <Option value="Two">Two</Option>
      </Select>,
    );

    expect(container.querySelector('.rc-select-clear')).toBeTruthy();
  });

  it("should hide clear icon when inputValue is ''", () => {
    const { container } = render(
      <Select mode="combobox" allowClear>
        <Option value="One">One</Option>
        <Option value="Two">Two</Option>
      </Select>,
    );

    fireEvent.change(container.querySelector('input')!, { target: { value: '1' } });
    expect(container.querySelector('.rc-select-clear')).toBeTruthy();
    fireEvent.change(container.querySelector('input')!, { target: { value: '' } });
    expect(container.querySelector('.rc-select-clear')).toBeFalsy();
  });

  it('autocomplete - option update when input change', () => {
    class App extends React.Component {
      public state = {
        options: [],
      };

      public updateOptions = (value) => {
        const options = [value, value + value, value + value + value];
        this.setState({
          options,
        });
      };

      public render() {
        return (
          <Select mode="combobox" onChange={this.updateOptions}>
            {this.state.options.map((opt) => (
              <Option key={opt} value={opt}>
                {opt}
              </Option>
            ))}
          </Select>
        );
      }
    }

    const { container } = render(<App />);
    fireEvent.change(container.querySelector('input')!, { target: { value: 'a' } });
    fireEvent.change(container.querySelector('input')!, { target: { value: 'ab' } });
    expect(container.querySelector('input')!.value).toBe('ab');
    selectItem(container, 1);
    expect(container.querySelector('input')!.value).toBe('abab');
  });

  it("when value change to '', searchValue will change to '' ", () => {
    class App extends React.Component {
      public state = {
        value: '2',
      };

      public render() {
        return (
          <div>
            <button onClick={() => this.setState({ value: '' })}>value to 0</button>
            <Select
              value={this.state.value}
              open
              mode="combobox"
              onChange={(value) => this.setState({ value })}
              filterOption={(inputValue, option) => {
                if (!inputValue) {
                  return true;
                }
                return (option.value as string).includes(inputValue);
              }}
            >
              {['1'].map((i) => (
                <Option value={i} key={i}>
                  {i}
                </Option>
              ))}
            </Select>
          </div>
        );
      }
    }

    const { container } = render(<App />);
    expect(container.querySelector('.rc-select-item-option')).toBeFalsy();
    fireEvent.click(container.querySelector('button')!);
    expect(container.querySelector('.rc-select-item-option')).toBeTruthy();
  });

  // [Legacy] `optionLabelProp` should not work on `combobox`
  // https://github.com/ant-design/ant-design/issues/10367
  // origin test: https://github.com/react-component/select/blob/e5fa4959336f6a423b6e30652b9047510bb6f78f/tests/Select.combobox.spec.tsx#L362
  it('should  autocomplete with correct option value', () => {
    resetWarned();

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Select mode="combobox" optionLabelProp="children" />);
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `combobox` mode not support `optionLabelProp`. Please set `value` on Option directly.',
    );
    errorSpy.mockRestore();
  });

  // https://github.com/ant-design/ant-design/issues/16572
  it('close when enter press without active option', () => {
    jest.useFakeTimers();
    const onPopupVisibleChange = jest.fn();
    const { container } = render(
      <Select mode="combobox" open onPopupVisibleChange={onPopupVisibleChange}>
        <Option value="One">One</Option>
        <Option value="Two">Two</Option>
      </Select>,
    );
    keyDown(container.querySelector('input')!, KeyCode.ENTER);
    jest.runAllTimers();
    expect(onPopupVisibleChange).toHaveBeenCalledWith(false);
    jest.useRealTimers();
  });

  it('should reset value by control', () => {
    jest.useFakeTimers();
    const onChange = jest.fn();
    const { container } = render(
      <Select mode="combobox" value="" onChange={onChange}>
        <Option value="One">One</Option>
        <Option value="Two">Two</Option>
      </Select>,
    );

    toggleOpen(container);
    selectItem(container);
    jest.runAllTimers();
    expect(onChange).toHaveBeenCalled();
    expectOpen(container, false);

    expect(container.querySelector('input')!).toHaveValue('');
    jest.useRealTimers();
  });

  it('should keep close after blur', async () => {
    const { container } = render(
      <Select mode="combobox" notFoundContent={null}>
        <Option value="One">One</Option>
      </Select>,
    );

    toggleOpen(container);
    expectOpen(container);

    // Click again should not close popup
    for (let i = 0; i < 10; i += 1) {
      fireEvent.mouseDown(container.querySelector('input')!);
      expectOpen(container);

      await delay(100);
    }

    fireEvent.blur(container.querySelector('input')!);
    container.querySelector('input').blur();

    await delay(100);

    expectOpen(container, false);
  });

  it('expect null value display empty string', () => {
    const { container } = render(<Select mode="combobox" value={null} />);

    expect(container.querySelector('input')!.value).toBe('');
  });

  describe('maxLength', () => {
    it('should support', () => {
      const { container } = render(<Select maxLength={6} />);
      expect(container.querySelector('input')).not.toHaveAttribute('maxLength');
    });

    it('normal should not support', () => {
      const { container } = render(<Select mode="combobox" maxLength={6} />);
      expect(container.querySelector('input')!.getAttribute('maxLength')).toBe('6');
    });
  });

  it('typewriting should not trigger onChange multiple times', () => {
    const onChange = jest.fn();
    const { container } = render(<Select mode="combobox" onChange={onChange} />);

    fireEvent.change(container.querySelector('input')!, { target: { value: '' } });
    fireEvent.change(container.querySelector('input')!, { target: { value: 'a' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith('a', expect.anything());

    fireEvent.change(container.querySelector('input')!, { target: { value: '啊' } });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith('啊', expect.anything());

    fireEvent.change(container.querySelector('input')!, { target: { value: '啊' } });
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('default filterOption is false', () => {
    const { container } = render(
      <Select
        mode="combobox"
        open
        searchValue="not exist"
        options={[
          {
            label: 'Light',
            value: 'light',
          },
          {
            label: 'Bamboo',
            value: 'bamboo',
          },
        ]}
      />,
    );

    expect(container.querySelectorAll('.rc-select-item-option')).toHaveLength(2);
  });

  // https://github.com/ant-design/ant-design/issues/34975
  it('should not contain selected className in combobox mode', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Select mode="combobox" onChange={onChange}>
        <Option value="One">One</Option>
        <Option value="Two">Two</Option>
      </Select>,
    );
    toggleOpen(container);
    selectItem(container);
    expect(container.querySelector('.rc-select-item-option-selected')).toBeFalsy();
  });

  // https://github.com/ant-design/ant-design/issues/38844
  it('not show dropdown when options changed', () => {
    jest.useFakeTimers();
    const { container, rerender } = render(<Select mode="combobox" options={[]} />);

    fireEvent.mouseDown(container.querySelector('input'));
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.blur(container.querySelector('input'));
    act(() => {
      container.querySelector('input').blur();
      jest.runAllTimers();
    });

    rerender(<Select mode="combobox" options={[{ value: 'shouldHide' }]} />);
    expect(document.body.querySelector('.rc-select-dropdown-hidden')).toBeTruthy();

    jest.useRealTimers();
  });

  // https://github.com/ant-design/ant-design/issues/43936
  it('combobox mode not show 0 value', () => {
    const { container } = render(<Select mode="combobox" value={0} />);
    expect(container.querySelector('input')!.value).toBe('0');
  });

  // https://github.com/ant-design/ant-design/issues/48281
  describe('combobox mode onMouseDown event default behavior', () => {
    it('should prevent default behavior when mode is combobox', () => {
      const preventDefault = jest.fn();
      const { container } = render(
        <Select mode="combobox" value="1">
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      );

      const selectorEle = container.querySelector('.rc-select');

      const mouseDownEvent = createEvent.mouseDown(selectorEle);
      mouseDownEvent.preventDefault = preventDefault;
      fireEvent(selectorEle, mouseDownEvent);
      expect(preventDefault).toHaveBeenCalled();
    });

    it('should not prevent default behavior when mode is combobox and it is disabled', () => {
      const preventDefault = jest.fn();
      const { container } = render(
        <Select mode="combobox" value="1" disabled>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      );

      const selectorEle = container.querySelector('.rc-select');

      const mouseDownEvent = createEvent.mouseDown(selectorEle);
      mouseDownEvent.preventDefault = preventDefault;
      fireEvent(selectorEle, mouseDownEvent);
      expect(preventDefault).not.toHaveBeenCalled();
    });

    // https://github.com/ant-design/ant-design/issues/56948
    // https://github.com/ant-design/ant-design/issues/56932
    it('should not render value in combobox mode with custom input', () => {
      const CustomInput = (props: any) => <input {...props} />;

      const { container } = render(
        <Select
          mode="combobox"
          value="1"
          placeholder="Input value"
          getInputElement={() => <CustomInput />}
        >
          <Option value="1">One</Option>
          <Option value="2">Two</Option>
        </Select>,
      );

      // with custom input in combobox mode, renderValue should be null
      // So we should only see the input element, not the rendered value div
      expect(container.querySelector('.rc-select-content-value')).toBeFalsy();
      expect(container.querySelector('.rc-select-placeholder')).toBeFalsy();
      expect(container.querySelector('input')).toHaveValue('1');
      expect(container.querySelector('input')).toHaveAttribute('placeholder', 'Input value');
    });
  });
});
