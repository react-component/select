import type { LabelInValueType } from '@/Select';
import {
  createEvent,
  fireEvent,
  render,
  render as testingRender,
  act,
} from '@testing-library/react';
import KeyCode from 'rc-util/lib/KeyCode';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import { resetWarned } from 'rc-util/lib/warning';
import type { ScrollConfig } from 'rc-virtual-list/lib/List';
import React from 'react';
import type { SelectProps } from '../src';
import Select, { OptGroup, Option, useBaseProps } from '../src';
import type { BaseSelectRef } from '../src/BaseSelect';
import allowClearTest from './shared/allowClearTest';
import blurTest from './shared/blurTest';
import focusTest from './shared/focusTest';
import inputFilterTest from './shared/inputFilterTest';
import keyDownTest from './shared/keyDownTest';
import openControlledTest from './shared/openControlledTest';
import {
  expectOpen,
  findSelection,
  injectRunAllTimers,
  keyDown,
  keyUp,
  selectItem,
  toggleOpen,
} from './utils/common';

describe('Select.Basic', () => {
  injectRunAllTimers(jest);

  allowClearTest(undefined, '903');
  focusTest('single', {});
  blurTest('single');
  keyDownTest('single');
  inputFilterTest('single');
  openControlledTest('single');

  describe('render', () => {
    function genSelect(props?: Partial<SelectProps>) {
      return (
        <Select
          prefixCls="antd"
          className="select-test"
          value="2"
          placeholder="Select a number"
          allowClear
          showSearch
          {...props}
        >
          <OptGroup label="manager">
            <Option className="option-test" value="jack">
              <b style={{ color: 'red' }}>jack</b>
            </Option>
            <Option value="lucy">lucy</Option>
          </OptGroup>
          <OptGroup label="engineer">
            <Option value="yiminghe">yiminghe</Option>
          </OptGroup>
        </Select>
      );
    }

    it('renders correctly', () => {
      const { container } = render(genSelect());
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders dropdown correctly', () => {
      const { container } = testingRender(genSelect({ open: true }));
      expect(container.querySelector('.rc-select-dropdown')).toMatchSnapshot();
    });

    it('renders disabled select correctly', () => {
      const { container } = render(genSelect({ disabled: true }));
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders data-attributes correctly', () => {
      const { container } = render(
        genSelect({
          'data-test': 'test-id',
          'data-id': '12345',
        } as any),
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders aria-attributes correctly', () => {
      const { container } = render(
        genSelect({
          'aria-labelledby': 'test-id',
          'aria-label': 'some-label',
        }),
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    // [Legacy] Should not use `role` since it's meaningless
    it('renders role prop correctly', () => {
      const { container } = render(
        genSelect({
          role: 'button',
        } as any),
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should support fieldName', () => {
      // groupLabel > fieldNames > self-label
      function genOpts(OptLabelName, groupLabel) {
        return [
          {
            [groupLabel]: 'groupLabel',
            options: [
              {
                value: 'value',
                [OptLabelName]: 'label',
              },
            ],
          },
        ];
      }

      const { container: containerFirst } = testingRender(
        <Select
          options={genOpts('label', 'groupLabel')}
          fieldNames={{
            groupLabel: 'groupLabel',
          }}
          open
        />,
      );
      const { container: containerSecond } = testingRender(
        <Select
          options={genOpts('groupLabel', 'groupLabel')}
          fieldNames={{ label: 'groupLabel' }}
          open
        />,
      );
      const { container: containerThird } = testingRender(
        <Select options={genOpts('label', 'label')} open />,
      );

      // these generate the same snapshots
      expect(containerFirst.querySelector('.rc-virtual-list')).toMatchSnapshot();
      expect(containerSecond.querySelector('.rc-virtual-list')).toMatchSnapshot();
      expect(containerThird.querySelector('.rc-virtual-list')).toMatchSnapshot();
    });
  });

  it('item label should be the same as user enter when set groupLabel', () => {
    const { container } = testingRender(
      <Select
        options={[
          {
            label: 'itemLabel',
            value: 'itemValue',
          },
        ]}
        fieldNames={{
          groupLabel: 'groupLabel',
        }}
        open
      />,
    );
    expect(container.querySelector('.rc-select-item-option-content').innerHTML).toBe('itemLabel');
  });

  it('convert value to array', () => {
    const { container } = render(
      <Select value="1" optionLabelProp="children">
        <OptGroup>
          <Option value="1" title="一">
            1-label
          </Option>
        </OptGroup>
      </Select>,
    );

    expect(findSelection(container).textContent).toEqual('1-label');
  });

  it('convert defaultValue to array', () => {
    const { container } = render(
      <Select defaultValue="1">
        <OptGroup>
          <Option value="1" title="一">
            1
          </Option>
        </OptGroup>
      </Select>,
    );
    expect(findSelection(container).textContent).toEqual('1');
  });

  it('not add open className when result is empty and no notFoundContent given', () => {
    const { container } = render(<Select mode="combobox" notFoundContent={false} />);
    toggleOpen(container);
    expectOpen(container, false);
  });

  it('should show empty class', () => {
    const wrapper1 = render(
      <Select open>
        <Select.Option value="bamboo">Bamboo</Select.Option>
      </Select>,
    );
    expect(wrapper1.container.querySelector('.rc-select-dropdown')).not.toHaveClass(
      'rc-select-dropdown-empty',
    );

    const wrapper2 = render(<Select open />);
    expect(wrapper2.container.querySelector('.rc-select-dropdown')).toHaveClass(
      'rc-select-dropdown-empty',
    );
  });

  it('should default select the right option', () => {
    const { container } = render(
      <Select defaultValue="2">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    toggleOpen(container);
    expect(
      container.querySelector('.rc-select-item-option-selected div.rc-select-item-option-content')
        .textContent,
    ).toBe('2');
  });

  it('should can select multiple items', () => {
    const { container } = render(
      <Select mode="multiple" value={['1', '2']}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">2</Option>
      </Select>,
    );
    toggleOpen(container);
    expect(
      Array.from(
        container.querySelectorAll(
          '.rc-select-item-option-selected div.rc-select-item-option-content',
        ),
      ).map((node) => node.textContent),
    ).toEqual(['1', '2']);
  });

  it('should hide clear button', () => {
    const { container: container1 } = render(
      <Select allowClear value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    expect(container1.querySelector('.rc-select-clear-icon')).toBeTruthy();

    const { container: container2 } = render(
      <Select allowClear>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    expect(container2.querySelector('.rc-select-clear-icon')).toBeFalsy();

    const { container: container3 } = render(
      <Select allowClear={{ clearIcon: <div className="custom-clear-icon">x</div> }} value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    expect(container3.querySelector('.custom-clear-icon')).toBeTruthy();
    expect(container3.querySelector('.custom-clear-icon').textContent).toBe('x');

    const { container: container4 } = render(
      <Select allowClear={{ clearIcon: <div className="custom-clear-icon">x</div> }}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    expect(container4.querySelector('.custom-clear-icon')).toBeFalsy();

    resetWarned();
    const { container: container5 } = render(
      <Select allowClear clearIcon={<div className="custom-clear-icon">x</div>} value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    expect(container5.querySelector('.custom-clear-icon')).toBeTruthy();
    expect(container5.querySelector('.custom-clear-icon').textContent).toBe('x');

    const { container: container6 } = render(
      <Select allowClear clearIcon={<div className="custom-clear-icon">x</div>}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    expect(container6.querySelector('.custom-clear-icon')).toBeFalsy();
  });

  it('should direction rtl', () => {
    const Hooker = () => {
      const { direction } = useBaseProps();
      return <span className="direction">{direction}</span>;
    };

    const { container } = render(
      <Select
        direction="rtl"
        dropdownRender={(origin) => (
          <>
            <Hooker />
            {origin}
          </>
        )}
        open
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(container.querySelector('.direction').textContent).toEqual('rtl');
  });

  it('should not response click event when select is disabled', () => {
    const { container } = render(
      <Select disabled defaultValue="2">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    toggleOpen(container);
    expectOpen(container, false);
  });

  it('should show selected value in singleMode when close', () => {
    const { container } = render(
      <Select value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(findSelection(container).textContent).toBe('1');
  });

  it('search input should be editable initially', () => {
    const { container } = render(
      <Select showSearch>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>,
    );
    expect(container.querySelector('input').getAttribute('readonly')).toBeFalsy();
  });

  it('filter options by "value" prop by default', () => {
    const { container } = render(
      <Select showSearch>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>,
    );

    fireEvent.change(container.querySelector('input'), { target: { value: '1' } });
    expect(container.querySelectorAll('.rc-select-item-option-content')).toHaveLength(1);
    expect(container.querySelector('.rc-select-item-option-content').textContent).toBe('One');
  });

  it('should filter options when filterOption is true', () => {
    const { container } = render(
      <Select showSearch filterOption>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>,
    );

    fireEvent.change(container.querySelector('input'), { target: { value: '2' } });
    expect(container.querySelectorAll('.rc-select-item-option-content')).toHaveLength(1);
    expect(container.querySelector('.rc-select-item-option-content').textContent).toBe('Two');
  });

  it('should not filter options when filterOption is false', () => {
    const { container } = render(
      <Select filterOption={false}>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>,
    );

    fireEvent.change(container.querySelector('input'), { target: { value: '1' } });
    expect(container.querySelectorAll('.rc-select-item-option-content')).toHaveLength(2);
  });

  it('specify which prop to filter', () => {
    const { container } = render(
      <Select optionFilterProp="label" showSearch>
        <Option value="1" label="One">
          1
        </Option>
        <Option value="2" label="Two">
          2
        </Option>
      </Select>,
    );

    fireEvent.change(container.querySelector('input'), { target: { value: 'Two' } });

    expect(container.querySelectorAll('.rc-select-item-option-content')).toHaveLength(1);
    expect(container.querySelector('.rc-select-item-option-content').textContent).toBe('2');
  });

  it('filter array children', () => {
    const { container } = render(
      <Select optionFilterProp="children" showSearch>
        <Option value="1" label="One">
          One{1}
        </Option>
        <Option value="2" label="Two">
          Two{2}
        </Option>
      </Select>,
    );

    fireEvent.change(container.querySelector('input'), { target: { value: 'Two2' } });

    expect(container.querySelectorAll('.rc-select-item-option-content')).toHaveLength(1);
    expect(container.querySelector('.rc-select-item-option-content').textContent).toBe('Two2');
  });

  it('no search', () => {
    const { container } = render(
      <Select showSearch={false} value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should contain falsy children', () => {
    const { container } = testingRender(
      <Select value="1" open>
        <Option value="1">1</Option>
        {null}
        <Option value="2">2</Option>
        {false}
      </Select>,
    );

    expect(container.querySelector('.rc-select-dropdown')).toMatchSnapshot();
  });

  it('open dropdown on down key press', () => {
    const { container } = render(
      <Select value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    keyDown(container.querySelector('input'), 40);
    expectOpen(container);
  });

  it('adds label to value', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <Select onChange={handleChange} labelInValue optionLabelProp="children">
        <Option value="1" testprop="test">
          One
        </Option>
        <Option value="2">Two</Option>
      </Select>,
    );

    toggleOpen(container);
    selectItem(container);
    expect(handleChange).toHaveBeenCalledWith(
      { key: '1', value: '1', label: 'One' },
      { children: 'One', key: null, testprop: 'test', value: '1' },
    );
  });

  it('give right option when use OptGroup', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <Select onChange={handleChange} labelInValue optionLabelProp="children">
        <OptGroup label="grouplabel">
          <Option value="1" testprop="test">
            One
          </Option>
        </OptGroup>
        <Option value="2">Two</Option>
      </Select>,
    );

    toggleOpen(container);
    selectItem(container);
    expect(handleChange).toHaveBeenCalledWith(
      { key: '1', label: 'One', value: '1' },
      { children: 'One', key: null, testprop: 'test', value: '1' },
    );
  });

  it('use label in props.value', () => {
    const { container } = render(
      <Select labelInValue value={{ key: 1, label: 'One' }}>
        <Option value="2">Two</Option>
      </Select>,
    );
    expect(findSelection(container).textContent).toEqual('One');
  });

  it('use label in props.defaultValue', () => {
    const { container } = render(
      <Select labelInValue defaultValue={{ key: 1, label: 'One' }}>
        <Option value="2">Two</Option>
      </Select>,
    );
    expect(findSelection(container).textContent).toEqual('One');
  });

  it('fires search event when user input', () => {
    const handleSearch = jest.fn();
    const { container } = render(
      <Select showSearch onSearch={handleSearch}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    fireEvent.change(container.querySelector('input'), { target: { value: '1' } });
    expect(handleSearch).toHaveBeenCalledWith('1');

    fireEvent.change(container.querySelector('input'), { target: { value: '' } });
    expect(handleSearch).toHaveBeenCalledWith('');
  });

  it('not fires search event when user select', () => {
    const handleSearch = jest.fn();
    const { container } = render(
      <Select showSearch onSearch={handleSearch}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    toggleOpen(container);
    selectItem(container);
    expect(handleSearch).not.toHaveBeenCalled();
  });

  it('not close when click on the input', () => {
    const { container } = render(
      <Select showSearch>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    for (let i = 0; i < 10; i += 1) {
      fireEvent.mouseDown(container.querySelector('input'));
      expectOpen(container);
    }
  });

  // Should always trigger search event:
  // https://github.com/ant-design/ant-design/issues/16223
  // https://github.com/ant-design/ant-design/issues/10817
  it('should also fires extra search event when user search and select', () => {
    jest.useFakeTimers();

    const handleSearch = jest.fn(() => console.trace());
    const { container } = render(
      <Select showSearch onSearch={handleSearch}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    fireEvent.change(container.querySelector('input'), { target: { value: '1' } });
    expect(handleSearch).toHaveBeenCalledTimes(1);

    // Not fire onSearch when value selected
    // https://github.com/ant-design/ant-design/pull/16235#issuecomment-487506523
    selectItem(container);
    expect(handleSearch).toHaveBeenCalledTimes(1);

    // Should trigger onBlur
    fireEvent.change(container.querySelector('input'), { target: { value: '3' } });
    expect(handleSearch).toHaveBeenCalledTimes(2);
    fireEvent.blur(container.querySelector('input'));
    jest.runAllTimers();
    expect(handleSearch).toHaveBeenCalledTimes(3);

    jest.useRealTimers();
  });

  it('should render 0 as text properly', () => {
    const data = [
      { text: 0, value: '=0' },
      { text: 1, value: '=1' },
    ];

    const { container } = render(
      <Select style={{ width: 120 }} open>
        {data.map((d) => (
          <Select.Option value={d.value} key={d.value}>
            {d.text}
          </Select.Option>
        ))}
      </Select>,
    );

    expect(container.querySelector('.rc-select-item-option-content').textContent).toEqual('0');
  });

  describe('focus', () => {
    let handleFocus;
    let container: HTMLElement;
    beforeEach(() => {
      jest.useFakeTimers();
      handleFocus = jest.fn();
      ({ container } = render(
        <Select onFocus={handleFocus} showSearch={false}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      ));

      fireEvent.focus(container.querySelector('input'));
      jest.runAllTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('fires focus event', () => {
      expect(handleFocus).toHaveBeenCalled();
      expect(handleFocus.mock.calls.length).toBe(1);
    });

    it('set className', () => {
      expect(container.querySelector('.rc-select').className).toContain('-focus');
    });
  });

  describe('click input will trigger focus', () => {
    let handleFocus: jest.Mock;
    let container: HTMLElement;
    beforeEach(() => {
      jest.useFakeTimers();
      handleFocus = jest.fn();
      ({ container } = render(
        <Select onFocus={handleFocus}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      ));

      const focusSpy = jest.spyOn(container.querySelector('input'), 'focus');

      fireEvent.mouseDown(container.querySelector('.rc-select-selector'));
      fireEvent.click(container.querySelector('.rc-select-selector'));
      expect(focusSpy).toHaveBeenCalled();

      // We should mock trigger focus event since it not work in jsdom
      fireEvent.focus(container.querySelector('input'));
      jest.runAllTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('fires focus event', () => {
      expect(handleFocus).toHaveBeenCalled();
      expect(handleFocus.mock.calls.length).toBe(1);
    });

    it('set className', () => {
      expect(container.querySelector('.rc-select').className).toContain('-focus');
    });

    it('focus input when placeholder is clicked', () => {
      const { container: container1 } = render(
        <Select placeholder="xxxx">
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      );
      const inputSpy = jest.spyOn(container1.querySelector('input'), 'focus');
      fireEvent.mouseDown(container1.querySelector('.rc-select-selection-placeholder'));
      fireEvent.click(container1.querySelector('.rc-select-selection-placeholder'));
      expect(inputSpy).toHaveBeenCalled();
    });
  });

  describe('blur', () => {
    let handleChange;
    let handleBlur;
    let container: HTMLElement;

    beforeEach(() => {
      jest.useFakeTimers();

      handleChange = jest.fn();
      handleBlur = jest.fn();
      ({ container } = render(
        <Select onChange={handleChange} onBlur={handleBlur} showSearch optionLabelProp="children">
          <Option value={1} key={1}>
            1-text
          </Option>
          <Option value={2} key={2}>
            2-text
          </Option>
        </Select>,
      ));

      fireEvent.focus(container.querySelector('input'));
      fireEvent.change(container.querySelector('input'), { target: { value: '1' } });
      fireEvent.blur(container.querySelector('input'));

      jest.runAllTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('fires blur event', () => {
      expect(handleBlur).toHaveBeenCalled();
    });

    it('set className', () => {
      expect(container.querySelector('.rc-select').className).not.toContain('-focus');
    });

    // Fix https://github.com/ant-design/ant-design/issues/6342
    it('should be close when blur Select[showSearch=false]', () => {
      ({ container } = render(
        <Select showSearch={false}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      ));
      toggleOpen(container);
      fireEvent.blur(container.querySelector('input'));
      act(() => {
        jest.runAllTimers();
      });
      expectOpen(container, false);
    });

    // Fix https://github.com/ant-design/ant-design/issues/7720
    it('should not trigger onFocus/onBlur when select is disabled', () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      ({ container } = render(
        <Select onFocus={onFocus} onBlur={onBlur} disabled>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      ));
      jest.useFakeTimers();
      fireEvent.focus(container.querySelector('input'));
      fireEvent.blur(container.querySelector('input'));
      act(() => {
        jest.runAllTimers();
      });
      expect(onFocus).not.toHaveBeenCalled();
      expect(onBlur).not.toHaveBeenCalled();
    });
  });

  [KeyCode.ENTER, KeyCode.DOWN].forEach((keyCode) => {
    it('open on key press', () => {
      const { container } = render(<Select />);
      keyDown(container.querySelector('input'), keyCode);
      expectOpen(container);
    });
  });

  it('close on ESC', () => {
    const onKeyDown = jest.fn();
    const { container } = render(
      <div onKeyDown={onKeyDown}>
        <Select />
      </div>,
    );
    toggleOpen(container);

    const inputEle = container.querySelector('input');
    fireEvent.change(inputEle, { target: { value: 'foo' } });
    keyDown(inputEle, KeyCode.ESC);

    expect(inputEle.value).toBe('');
    expectOpen(container, false);
    expect(onKeyDown).toHaveBeenCalledTimes(0);

    // should keep propagation when optionList is closed
    keyDown(inputEle, KeyCode.ESC);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('not open when system key down', () => {
    const { container } = render(
      <Select>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    const inputEle = container.querySelector('input');

    keyDown(inputEle, KeyCode.ESC);
    keyDown(inputEle, KeyCode.SHIFT);
    keyDown(inputEle, KeyCode.BACKSPACE);
    keyDown(inputEle, KeyCode.TAB);
    keyDown(inputEle, KeyCode.WIN_KEY);
    keyDown(inputEle, KeyCode.ALT);
    keyDown(inputEle, KeyCode.META);
    keyDown(inputEle, KeyCode.WIN_KEY_RIGHT);
    keyDown(inputEle, KeyCode.CTRL);
    keyDown(inputEle, KeyCode.SEMICOLON);
    keyDown(inputEle, KeyCode.EQUALS);
    keyDown(inputEle, KeyCode.CAPS_LOCK);
    keyDown(inputEle, KeyCode.CONTEXT_MENU);
    keyDown(inputEle, KeyCode.F1);
    keyDown(inputEle, KeyCode.F2);
    keyDown(inputEle, KeyCode.F3);
    keyDown(inputEle, KeyCode.F4);
    keyDown(inputEle, KeyCode.F5);
    keyDown(inputEle, KeyCode.F6);
    keyDown(inputEle, KeyCode.F7);
    keyDown(inputEle, KeyCode.F8);
    keyDown(inputEle, KeyCode.F9);
    keyDown(inputEle, KeyCode.F10);
    keyDown(inputEle, KeyCode.F11);
    keyDown(inputEle, KeyCode.F12);
    expectOpen(container, false);

    keyDown(inputEle, KeyCode.NUM_ONE);
    expectOpen(container, true);
  });

  it('close after select', () => {
    const { container } = render(
      <Select>
        <Option value="1">1</Option>
      </Select>,
    );

    toggleOpen(container);
    expectOpen(container);

    selectItem(container);
    expectOpen(container, false);
  });

  it('Controlled opening', () => {
    const renderDemo = (open: boolean) => (
      <Select open={open}>
        <Option value="1">1</Option>
      </Select>
    );

    const { container, rerender } = render(renderDemo(true));
    expectOpen(container);
    selectItem(container);
    expectOpen(container);

    rerender(renderDemo(false));
    expectOpen(container, false);
    selectItem(container);
    expectOpen(container, false);
  });

  it('Controlled onDropdownVisibleChange', () => {
    class Controlled extends React.Component {
      public state = {
        open: true,
      };

      public onDropdownVisibleChange = (open) => {
        this.setState({ open });
      };

      public render() {
        return (
          <Select open={this.state.open} onDropdownVisibleChange={this.onDropdownVisibleChange}>
            <Option value="1">1</Option>
          </Select>
        );
      }
    }
    const { container } = render(<Controlled />);
    expectOpen(container);
    toggleOpen(container);
    expectOpen(container, false);

    selectItem(container);
    expectOpen(container, false);
  });

  describe('combobox could customize input element', () => {
    it('work', () => {
      const onKeyDown = jest.fn();
      const onChange = jest.fn();
      const onMouseDown = jest.fn();
      const onCompositionStart = jest.fn();
      const onCompositionEnd = jest.fn();
      const textareaRef = jest.fn();
      const mouseDownPreventDefault = jest.fn();
      const { container } = render(
        <Select
          mode="combobox"
          getInputElement={() => (
            <textarea
              onKeyDown={onKeyDown}
              onChange={onChange}
              onMouseDown={onMouseDown}
              onCompositionStart={onCompositionStart}
              onCompositionEnd={onCompositionEnd}
              ref={textareaRef}
              className="custom-input"
            />
          )}
        >
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      );

      const textareaEle = container.querySelector('textarea');
      toggleOpen(container);

      const mouseDownEvent = createEvent.mouseDown(textareaEle);
      mouseDownEvent.preventDefault = mouseDownPreventDefault;
      fireEvent(textareaEle, mouseDownEvent);
      keyDown(textareaEle, KeyCode.NUM_ONE);
      fireEvent.change(textareaEle, { target: { value: '1' } });
      fireEvent.compositionStart(textareaEle);
      fireEvent.compositionEnd(textareaEle);

      selectItem(container);
      expect(textareaEle.value).toEqual('1');
      expect(textareaEle.className).toContain('custom-input');
      expect(mouseDownPreventDefault).not.toHaveBeenCalled();
      expect(onKeyDown).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalled();
      expect(onMouseDown).toHaveBeenCalled();
      expect(textareaRef).toHaveBeenCalled();
      expect(onCompositionStart).toHaveBeenCalled();
      expect(onCompositionEnd).toHaveBeenCalled();
    });

    it('not override customize props', () => {
      const { container } = render(
        <Select mode="combobox" getInputElement={() => <input type="email" />}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      );

      expect(container.querySelector('input').getAttribute('type')).toEqual('email');
    });
  });

  it('getRawInputElement for rc-cascader', () => {
    const { container } = render(
      <Select
        getRawInputElement={() => <span className="bamboo" />}
        options={[
          {
            label: <span className="little" />,
            value: 'little',
          },
        ]}
        open
      />,
    );

    expect(container.querySelector('.bamboo')).toBeTruthy();
    expect(container.querySelector('.little')).toBeTruthy();
  });

  describe('propTypes', () => {
    let errorSpy;

    beforeAll(() => {
      errorSpy = jest.spyOn(console, 'error').mockImplementation(() => null);
    });

    beforeEach(() => {
      errorSpy.mockReset();
      resetWarned();
    });

    afterAll(() => {
      errorSpy.mockRestore();
    });

    it('warns on invalid value when labelInValue', () => {
      render(<Select labelInValue value="foo" />);
      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: `value` should in shape of `{ value: string | number, label?: ReactNode }` when you set `labelInValue` to `true`',
      );
    });

    it('warns on invalid value when multiple', () => {
      render(<Select mode="multiple" value="" />);
      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: `value` should be array when `mode` is `multiple` or `tags`',
      );
    });
  });

  it('set label as key for OptGroup', () => {
    const { container } = render(
      <Select open>
        <OptGroup key="group1">
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </OptGroup>
      </Select>,
    );

    expect(container.querySelector('.rc-select-item-group').textContent).toBe('group1');
  });

  it('filters options by inputValue', () => {
    const { container } = render(
      <Select showSearch open>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="11" disabled>
          11
        </Option>
        <Option value="111">111</Option>
      </Select>,
    );

    fireEvent.change(container.querySelector('input'), { target: { value: '1' } });
    expect(container.querySelectorAll('.rc-select-item-option-content')).toHaveLength(3);
  });

  it('should include disabled item in options', () => {
    const { container } = render(
      <Select mode="tags" open value={['name1']}>
        <Option key="name1" value="name1" disabled>
          name1
        </Option>
        <Option key="name2" value="name2">
          name2
        </Option>
      </Select>,
    );
    expect(container.querySelectorAll('.rc-select-item-option-content')).toHaveLength(2);
  });

  it('renders not found when search result is empty', () => {
    const { container } = render(
      <Select showSearch open>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    fireEvent.change(container.querySelector('input'), { target: { value: '3' } });
    expect(container.querySelector('.rc-select-item')).toBeFalsy();
    expect(container.querySelector('.rc-select-item-empty').textContent).toEqual('Not Found');
  });

  it('search input type', () => {
    const { container } = render(
      <Select showSearch open>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    expect(container.querySelector('input').getAttribute('type')).toBe('search');
  });

  it('warns on invalid children', () => {
    const Foo = (value) => <div>foo{value}</div>;
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => null);
    render(
      <Select open>
        <Foo value="1" />
      </Select>,
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `children` should be `Select.Option` or `Select.OptGroup` instead of `Foo`.',
    );

    // Children in option group
    resetWarned();
    errorSpy.mockReset();
    render(
      <Select>
        <OptGroup label="bamboo">
          <span key="light" />
        </OptGroup>
      </Select>,
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `children` should be `Select.Option` or `Select.OptGroup` instead of `span`.',
    );

    errorSpy.mockRestore();
  });

  it('filterOption could be true as described in default value', () => {
    const { container } = testingRender(
      <Select searchValue="3" showSearch filterOption open>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(container.querySelector('.rc-select-dropdown')).toMatchSnapshot();
  });

  it('does not filter when filterOption value is false', () => {
    const { container } = testingRender(
      <Select inputValue="1" filterOption={false} open>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(container.querySelector('.rc-select-dropdown')).toMatchSnapshot();
  });

  it('backfill', () => {
    const triggerQueue: string[] = [];
    const handleChange = jest.fn(() => {
      triggerQueue.push('change');
    });
    const handleSelect = jest.fn(() => {
      triggerQueue.push('select');
    });
    const { container } = render(
      <Select
        backfill
        open
        mode="combobox"
        onChange={handleChange}
        onSelect={handleSelect}
        optionLabelProp="children"
      >
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>,
    );

    keyDown(container.querySelector('input'), KeyCode.DOWN);
    keyDown(container.querySelector('input'), KeyCode.DOWN);

    expect(container.querySelector('input').value).toEqual('2');
    expect(handleChange).not.toHaveBeenCalled();
    expect(handleSelect).not.toHaveBeenCalled();

    keyDown(container.querySelector('input'), KeyCode.ENTER);

    expect(container.querySelector('input').value).toEqual('2');
    expect(handleChange).toHaveBeenCalledWith('2', expect.anything());
    expect(handleSelect).toHaveBeenCalledWith('2', expect.anything());

    expect(triggerQueue).toEqual(['change', 'select']);
  });

  describe('number value', () => {
    it('support number value', () => {
      const handleChange = jest.fn();

      const { container } = render(
        <Select defaultValue={1} onChange={handleChange}>
          <Option value={1}>1</Option>
          <Option value={2}>2</Option>
        </Select>,
      );

      expect(findSelection(container).textContent).toEqual('1');

      toggleOpen(container);
      selectItem(container, 1);
      expect(handleChange).toHaveBeenCalledWith(2, expect.anything());
      expect(findSelection(container).textContent).toEqual('2');
    });

    it('search number value', () => {
      const { container } = render(
        <Select showSearch>
          <Option value={1}>1</Option>
          <Option value={2}>2</Option>
        </Select>,
      );

      fireEvent.change(container.querySelector('input'), { target: { value: '1' } });
      expect(container.querySelectorAll('.rc-select-item-option-content')).toHaveLength(1);
    });
  });

  it('should render custom dropdown correctly', () => {
    const { container } = testingRender(
      <Select
        open
        dropdownRender={(menu) => (
          <div>
            <div className="dropdown-custom-node">CUSTOM NODE</div>
            {menu}
          </div>
        )}
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    expect(container.querySelector('.rc-select-dropdown')).toMatchSnapshot();
  });

  it('should trigger click event in custom node', () => {
    jest.useFakeTimers();

    const onChildClick = jest.fn();
    const onMouseDown = jest.fn();
    const { container } = testingRender(
      <Select
        onMouseDown={onMouseDown}
        dropdownRender={(menu) => (
          <div>
            <div id="dropdown-custom-node" onClick={onChildClick}>
              CUSTOM NODE
            </div>
            {menu}
          </div>
        )}
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    // Open
    fireEvent.mouseDown(container.querySelector('.rc-select-selector'));

    fireEvent.mouseDown(container.querySelector('div#dropdown-custom-node'));
    fireEvent.click(container.querySelector('div#dropdown-custom-node'));
    expect(onMouseDown).toHaveBeenCalled();
    expect(onChildClick).toHaveBeenCalled();
  });

  it('set showAction', () => {
    const { container } = render(
      <Select showAction={['focus']}>
        <Option value="1">1</Option>
      </Select>,
    );

    expectOpen(container, false);
    fireEvent.focus(container.querySelector('input'));

    expectOpen(container);
  });

  it('default filterOption is case insensitive', () => {
    const { container } = render(
      <Select showSearch>
        <Option value="ABC">ABC</Option>
        <Option value="DEF">DEF</Option>
      </Select>,
    );

    fireEvent.change(container.querySelector('input'), { target: { value: 'b' } });
    expect(container.querySelectorAll('.rc-select-item-option-content')).toHaveLength(1);
    expect(container.querySelector('div.rc-select-item-option-content').textContent).toBe('ABC');
  });

  it('accepts prop id', () => {
    const { container } = render(
      <Select id="my-select">
        <Option value="1">One</Option>
      </Select>,
    );

    expect(container.querySelector('input#my-select')).toBeTruthy();
  });

  it('not select first option when no result', () => {
    const handleSelect = jest.fn();
    const { container } = render(
      <Select
        defaultActiveFirstOption
        filterOption={(inputValue, option) =>
          (option.children as string).toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        onSelect={handleSelect}
        showSearch
      >
        <Option value="Burns Bay Road">Burns Bay Road</Option>
        <Option value="Downing Street">Downing Street</Option>
        <Option value="Wall Street">Wall Street</Option>
      </Select>,
    );

    fireEvent.change(container.querySelector('input'), { target: { value: 'b' } });
    expect(container.querySelector('input').value).toBe('b');
    expect(container.querySelectorAll('.rc-select-item-option-content')).toHaveLength(1);
    expect(container.querySelector('div.rc-select-item-option-content').textContent).toBe(
      'Burns Bay Road',
    );

    fireEvent.change(container.querySelector('input'), { target: { value: 'c' } });
    expect(container.querySelector('input').value).toBe('c');
    expect(container.querySelectorAll('.rc-select-item')).toHaveLength(0);
    expect(container.querySelector('.rc-select-item-empty').textContent).toEqual('Not Found');

    keyDown(container.querySelector('input'), KeyCode.ENTER);
    expect(handleSelect).not.toHaveBeenCalled();
  });

  // https://github.com/ant-design/ant-design/issues/12172
  it('onChange trigger only once when value is 0', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Select onChange={onChange}>
        <Option value={0}>0</Option>
      </Select>,
    );

    toggleOpen(container);
    selectItem(container);
    expect(onChange).toHaveBeenCalled();

    onChange.mockReset();

    toggleOpen(container);
    selectItem(container);
    expect(onChange).not.toHaveBeenCalled();
  });

  // https://github.com/ant-design/ant-design/issues/12260
  describe('dropdownMatchSelectWidth', () => {
    let domHook;

    beforeAll(() => {
      domHook = spyElementPrototypes(HTMLElement, {
        getBoundingClientRect: () => ({
          width: 1000,
        }),
      });
    });

    afterAll(() => {
      domHook.mockRestore();
    });

    it('dropdown menu width should not be smaller than trigger even dropdownMatchSelectWidth is false', () => {
      const options = [];
      for (let i = 0; i < 99; i += 1) {
        options.push({
          value: i,
        });
      }

      const { container } = render(
        <Select
          listItemHeight={10}
          listHeight={100}
          style={{ width: 1000 }}
          dropdownMatchSelectWidth={false}
          options={options}
        />,
      );
      toggleOpen(container);
      expect(container.querySelector('.rc-select-dropdown')).toHaveStyle({
        minWidth: '1000px',
      });

      // dropdownMatchSelectWidth is false means close virtual scroll
      expect(container.querySelectorAll('.rc-select-item')).toHaveLength(options.length);
    });

    it('virtual false also no render virtual list', () => {
      const options = [];
      for (let i = 0; i < 99; i += 1) {
        options.push({
          value: i,
        });
      }

      const { container } = render(
        <Select listItemHeight={10} listHeight={100} virtual={false} options={options} />,
      );
      toggleOpen(container);
      expect(container.querySelectorAll('.rc-select-item')).toHaveLength(options.length);
    });
  });

  it('dropdown should auto-adjust horizontally when dropdownMatchSelectWidth is false', () => {
    render(
      <Select dropdownMatchSelectWidth={233}>
        <Option value={0}>0</Option>
        <Option value={1}>1</Option>
      </Select>,
    );

    expect(global.triggerProps.builtinPlacements.bottomLeft.overflow.adjustX).toBe(1);
  });

  it('dropdown should not auto-adjust horizontally when dropdownMatchSelectWidth is true', () => {
    render(
      <Select>
        <Option value={0}>0</Option>
        <Option value={1}>1</Option>
      </Select>,
    );
    // expect(
    //   (container.find('Trigger').prop('builtinPlacements') as any).bottomLeft.overflow.adjustX,
    // ).toBe(0);

    expect(global.triggerProps.builtinPlacements.bottomLeft.overflow.adjustX).toBe(0);
  });

  it('if loading, arrow should show loading icon', () => {
    const { container } = render(
      <Select style={{ width: 1000 }} loading>
        <Option value={0}>0</Option>
        <Option value={1}>1</Option>
      </Select>,
    );
    expect(container.querySelector('.rc-select-arrow-loading')).toBeTruthy();
  });
  it('if loading and multiple which has not arrow, but have loading icon', () => {
    const renderDemo = (loading?: boolean) => (
      <Select style={{ width: 1000 }} mode="multiple" loading={loading}>
        <Option value={0}>0</Option>
        <Option value={1}>1</Option>
      </Select>
    );

    const { container, rerender } = render(renderDemo());
    expect(container.querySelector('.rc-select-arrow-icon')).toBeFalsy();
    expect(container.querySelector('.rc-select-arrow-loading')).toBeFalsy();

    rerender(renderDemo(true));
    expect(container.querySelector('.rc-select-arrow-loading')).toBeTruthy();
  });

  it('should keep trigger onSelect by select', () => {
    const onSelect = jest.fn();
    const { container } = render(
      <Select open onSelect={onSelect} optionLabelProp="children">
        <Option value="1">One</Option>
      </Select>,
    );

    for (let i = 0; i < 10; i += 1) {
      onSelect.mockReset();
      keyDown(container.querySelector('input'), KeyCode.ENTER);
      keyUp(container.querySelector('input'), KeyCode.ENTER);
      expect(onSelect).toHaveBeenCalledWith('1', expect.anything());
    }
  });

  it('should warning using `onSearch` if not set `showSearch`', () => {
    resetWarned();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => null);

    render(<Select onSearch={jest.fn()} />);
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `onSearch` should work with `showSearch` instead of use alone.',
    );

    errorSpy.mockRestore();
  });

  it('dropdown selection item customize icon', () => {
    const menuItemSelectedIcon = jest.fn();

    render(
      <Select
        value="1"
        options={[{ value: '1' } as any]}
        open
        menuItemSelectedIcon={menuItemSelectedIcon}
      />,
    );
    expect(menuItemSelectedIcon).toHaveBeenCalledWith({
      value: '1',
      disabled: false,
      isSelected: true,
    });

    render(
      <Select
        value="1"
        options={[{ value: '2', disabled: true } as any]}
        open
        menuItemSelectedIcon={menuItemSelectedIcon}
      />,
    );
    expect(menuItemSelectedIcon).toHaveBeenCalledWith({
      value: '2',
      disabled: true,
      isSelected: false,
    });
  });

  it('keyDown & KeyUp event', () => {
    const onKeyDown = jest.fn();
    const onKeyUp = jest.fn();
    const { container } = render(<Select onKeyDown={onKeyDown} onKeyUp={onKeyUp} />);

    keyDown(container.querySelector('input'), KeyCode.ENTER);
    expectOpen(container);
    expect(onKeyDown).toHaveBeenCalled();

    fireEvent.keyUp(container.querySelector('input'), { which: KeyCode.ENTER });
    expect(onKeyUp).toHaveBeenCalled();
  });

  describe('warning if label not same as option', () => {
    it('should work', () => {
      resetWarned();

      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      render(
        <Select value={{ value: '2', label: 'One' }} labelInValue>
          <Option value="2">Two</Option>
        </Select>,
      );
      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: `label` of `value` is not same as `label` in Select options.',
      );
      errorSpy.mockRestore();
    });

    it('not warning for react node', () => {
      resetWarned();
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const Demo = () => {
        const [, setVal] = React.useState(0);

        return (
          <Select
            onChange={setVal}
            defaultValue={0}
            options={[
              {
                value: 0,
                label: <div />,
              },
              {
                value: 1,
                label: <div />,
              },
            ]}
          />
        );
      };

      const { container } = render(<Demo />);

      toggleOpen(container);
      selectItem(container, 1);

      expect(errorSpy).not.toHaveBeenCalled();
      errorSpy.mockRestore();
    });
  });

  describe('warning if use `props` to read data', () => {
    it('filterOption', () => {
      resetWarned();
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const { container } = render(
        <Select
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          showSearch
        >
          <Option value="light">Light</Option>
          <Option value="bamboo">Bamboo</Option>
        </Select>,
      );

      fireEvent.change(container.querySelector('input'), { target: { value: 'l' } });
      expect(container.querySelectorAll('.rc-select-item-option-content')).toHaveLength(1);
      expect(container.querySelector('div.rc-select-item-option-content').textContent).toBe(
        'Light',
      );

      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: Return type is option instead of Option instance. Please read value directly instead of reading from `props`.',
      );
      errorSpy.mockRestore();
    });

    it('Select & Deselect', () => {
      resetWarned();
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const readPropsFunc = (_, opt) => {
        expect(opt.props).toBeTruthy();
      };

      const { container } = render(
        <Select mode="multiple" onSelect={readPropsFunc} onDeselect={readPropsFunc}>
          <Option value="light">Light</Option>
          <Option value="bamboo">Bamboo</Option>
        </Select>,
      );

      toggleOpen(container);
      selectItem(container);
      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: Return type is option instead of Option instance. Please read value directly instead of reading from `props`.',
      );

      errorSpy.mockReset();
      resetWarned();
      selectItem(container);
      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: Return type is option instead of Option instance. Please read value directly instead of reading from `props`.',
      );

      errorSpy.mockRestore();
    });

    it('onChange', () => {
      resetWarned();
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const readPropsFunc = (_, opt) => {
        expect(opt.props).toBeTruthy();
      };

      const { container } = render(
        <Select onChange={readPropsFunc}>
          <Option value="light">Light</Option>
          <Option value="bamboo">Bamboo</Option>
        </Select>,
      );

      toggleOpen(container);
      selectItem(container);
      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: Return type is option instead of Option instance. Please read value directly instead of reading from `props`.',
      );

      errorSpy.mockRestore();
    });
  });

  it('not crash when options is null', () => {
    render(<Select options={null} />);
  });

  it('not crash when labelInValue and value is null', () => {
    render(<Select labelInValue value={null} />);
  });

  it('not open when `notFoundCount` is empty & no data', () => {
    const { container } = render(<Select options={null} notFoundContent={null} open showSearch />);
    expect(container.querySelector('.rc-select-dropdown-empty')).toBeFalsy();
  });

  it('click outside to close select', () => {
    const { container } = render(
      <Select>
        <Option value="1">One</Option>
      </Select>,
    );

    toggleOpen(container);

    const clickEvent = new Event('mousedown');
    Object.defineProperty(clickEvent, 'target', {
      get: () => document.body,
    });
    act(() => {
      window.dispatchEvent(clickEvent);
    });

    expectOpen(container, false);
  });

  describe('reset value to undefined should reset display value', () => {
    [undefined].forEach((value) => {
      it(`to ${value}`, () => {
        const { container, rerender } = render(<Select value="light" />);
        expect(container.querySelector('.rc-select-selection-item').textContent).toEqual('light');

        rerender(<Select value={value} />);
        expect(container.querySelector('.rc-select-selection-item')).toBeFalsy();
      });
    });
  });

  describe('disabled on open', () => {
    it('should not show dropdown when open and disabled', () => {
      const { container } = render(
        <Select open disabled>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      );
      expectOpen(container, false);
    });

    it('should close dropdown when disabled after open', () => {
      const renderDemo = (disabled?: boolean) => (
        <Select disabled={disabled}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
      );
      const { container, rerender } = render(renderDemo());
      toggleOpen(container);
      expectOpen(container, true);
      rerender(renderDemo(true));
      expectOpen(container, false);
    });

    it('should not open dropdown after remove disabled', () => {
      const renderDemo = (disabled?: boolean) => (
        <Select disabled={disabled}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
      );

      const { container, rerender } = render(renderDemo());
      toggleOpen(container);
      rerender(renderDemo(true));
      rerender(renderDemo(false));
      expectOpen(container, false);
    });
  });

  it('should pass className & style to option', () => {
    const { container } = render(
      <Select
        options={[
          {
            value: 'test',
            className: 'test-class',
            style: { background: 'yellow' },
          } as any,
        ]}
      />,
    );
    toggleOpen(container);
    expect(container.querySelector('.rc-select-item-option')).toHaveClass('test-class');
    expect(container.querySelector('.rc-select-item-option')).toHaveStyle({
      background: 'yellow',
    });
  });

  describe('`null` is a value', () => {
    let errorSpy;
    const warningMessage = 'Warning: `value` in Select options should not be `null`.';

    beforeAll(() => {
      errorSpy = jest.spyOn(console, 'error').mockImplementation(() => null);
    });

    beforeEach(() => {
      errorSpy.mockReset();
      resetWarned();
    });

    afterAll(() => {
      errorSpy.mockRestore();
    });

    it('`null` is a value and should throw a warning', () => {
      const onChange = jest.fn();

      const { container } = render(
        <Select onChange={onChange}>
          <Option value={1}>1</Option>
          <Option value={null}>No</Option>
          <Option value={0}>0</Option>
          <Option value="">Empty</Option>
        </Select>,
      );

      [
        [1, '1'],
        [null, 'No'],
        [0, '0'],
        ['', 'Empty'],
      ].forEach(([value, showValue], index) => {
        toggleOpen(container);
        selectItem(container, index);
        expect(onChange).toHaveBeenCalledWith(value, expect.anything());
        expect(container.querySelector('.rc-select-selection-item').textContent).toEqual(showValue);
      });

      expect(errorSpy).toHaveBeenCalledWith(warningMessage);
    });

    it('`null` is a value in OptGroup should throw a warning', () => {
      render(
        <Select>
          <OptGroup>
            <Option value="1">1</Option>
            <Option value={null}>null</Option>
          </OptGroup>
        </Select>,
      );

      expect(errorSpy).toHaveBeenCalledWith(warningMessage);
    });

    it('`null` is a value in fieldNames should throw a warning', () => {
      render(
        <Select
          fieldNames={{
            label: 'fieldLabel',
            value: 'fieldValue',
            options: 'fieldOptions',
          }}
          options={[
            {
              fieldLabel: 'label',
              fieldOptions: [
                {
                  fieldLabel: '1',
                  fieldValue: '1',
                },
                {
                  fieldLabel: '2',
                  fieldValue: null,
                },
              ],
            },
          ]}
        />,
      );

      expect(errorSpy).toHaveBeenCalledWith(warningMessage);
    });
  });

  it('Remove options can keep the cache', () => {
    const renderDemo = (props?: any) => (
      <Select value={903} options={[{ value: 903, label: 'Bamboo' }]} {...props} />
    );
    const { container, rerender } = render(renderDemo());
    expect(findSelection(container).textContent).toEqual('Bamboo');

    rerender(renderDemo({ options: [] }));
    expect(findSelection(container).textContent).toEqual('Bamboo');

    rerender(renderDemo({ options: [{ value: 903, label: 903 }] }));
    expect(findSelection(container).textContent).toEqual('903');
  });

  // https://github.com/ant-design/ant-design/issues/24747
  // This can not test function called with jest spy, coverage only
  it('mouse enter to refresh', () => {
    let renderTimes = 0;
    const Wrapper = ({ children }: any) => {
      renderTimes += 1;
      return children;
    };

    const { container } = render(
      <Select
        options={[{ value: 903, label: 'Bamboo' }]}
        dropdownRender={(node) => <Wrapper>{node}</Wrapper>}
        open
      />,
    );

    renderTimes = 0;
    fireEvent.mouseEnter(container.querySelector('.rc-select-item-option-content'));
    expect(renderTimes).toBe(1);
  });

  it('filterSort should work', () => {
    const { container } = render(
      <Select
        showSearch
        filterSort={(optionA, optionB) =>
          (optionA.label as string).localeCompare(optionB.label as string)
        }
        optionFilterProp="label"
        options={[
          { value: 4, label: 'Not Identified' },
          { value: 3, label: 'Closed' },
          { value: 2, label: 'Communicated' },
          { value: 5, label: 'Cancelled' },
        ]}
      />,
    );

    fireEvent.change(container.querySelector('input'), { target: { value: 'i' } });
    expect(container.querySelector('.rc-select-item-option-content').textContent).toBe(
      'Communicated',
    );
  });

  it('filterSort should work with search value', () => {
    const { container } = render(
      <Select
        showSearch
        filterSort={(optionA, optionB, { searchValue }) => {
          const i =
            (optionA.label as string).indexOf(searchValue) -
            (optionB.label as string).indexOf(searchValue);
          if (i == 0) {
            return (optionA.label as string).localeCompare(optionB.label as string);
          }
          return i;
        }}
        optionFilterProp="label"
        options={[
          { value: 4, label: 'Not Identified' },
          { value: 3, label: 'Closed' },
          { value: 2, label: 'Communicated' },
          { value: 5, label: 'Cancelled' },
        ]}
      />,
    );

    fireEvent.change(container.querySelector('input'), { target: { value: 'o' } });
    expect(container.querySelector('.rc-select-item-option-content').textContent).toBe(
      'Communicated',
    );
  });

  it('filterSort should work with search value when grouping', () => {
    const { container } = render(
      <Select
        open
        showSearch
        searchValue="entry"
        style={{ width: 100 }}
        placeholder="Search to Select"
        optionFilterProp="label"
        filterSort={(optionA, optionB, info) => {
          if (!info.searchValue) return 0;
          const labelA = (optionA?.label ?? '').toLowerCase();
          const labelB = (optionB?.label ?? '').toLowerCase();
          const matchA = labelA.startsWith(info.searchValue);
          const matchB = labelB.startsWith(info.searchValue);
          if (matchA && !matchB) return -1;
          if (!matchA && matchB) return 1;
          return labelA.localeCompare(labelB);
        }}
        options={[
          {
            value: 'group1',
            label: 'group1',
            options: [
              { label: 'Entry1', value: 'Entry1' },
              { label: 'Entry2', value: 'Entry2' },
              { label: 'Entry3', value: 'Entry3' },
              { label: 'Entry', value: 'Entry' },
            ],
          },
        ]}
      />,
    );
    expect(container.querySelector('.rc-select-item-option-grouped').textContent).toBe('Entry');
  });

  it('correctly handles the `tabIndex` prop', () => {
    const { container } = render(<Select tabIndex={0} />);
    expect(container.querySelector('.rc-select').getAttribute('tabindex')).toBeFalsy();

    expect(
      container.querySelector('input.rc-select-selection-search-input').getAttribute('tabindex'),
    ).toBe('0');
  });

  describe('placement', () => {
    it('default', () => {
      render(<Select open />);
      expect(global.triggerProps.popupPlacement).toEqual('bottomLeft');
    });

    it('rtl', () => {
      render(<Select direction="rtl" open />);
      expect(global.triggerProps.popupPlacement).toEqual('bottomRight');
    });

    it('customize', () => {
      render(<Select placement="topRight" open />);
      expect(global.triggerProps.popupPlacement).toEqual('topRight');
    });
  });

  it('scrollTo should work with number', () => {
    const ref = React.createRef<BaseSelectRef>();
    const { rerender } = render(<Select ref={ref} />);

    // Not crash
    ref.current.scrollTo(100);

    // Open to call again
    rerender(<Select ref={ref} open />);
    ref.current.scrollTo(100);
  });

  it('scrollTo should work with scrollConfig object', () => {
    const ref = React.createRef<BaseSelectRef>();
    const { rerender } = render(<Select ref={ref} />);
    const scrollParams: ScrollConfig = {
      index: 30,
      align: 'top',
    };

    // Not crash
    ref.current.scrollTo(scrollParams);

    // Open to call again
    rerender(<Select ref={ref} open />);
    ref.current.scrollTo(scrollParams);
  });

  it('pass props', () => {
    // `count` is not a valid dom prop. Just compatible with origin logic.
    const { container } = render(
      <Select
        {...({
          count: 10,
        } as any)}
      />,
    );

    expect(container.querySelector('.rc-select').getAttribute('count')).toEqual('10');
  });

  it('should support onClick', () => {
    const onClick = jest.fn();
    const { container } = render(<Select onClick={onClick} />);
    fireEvent.click(container.querySelector('.rc-select-selector'));
    expect(onClick).toHaveBeenCalled();
  });

  it('no warning for non-dom attr', () => {
    const { container } = render(
      <Select open>
        <Select.Option light="little" data-test="good" aria-label="well">
          Bamboo
        </Select.Option>
      </Select>,
    );

    expect(container.querySelector('div.rc-select-item')).not.toHaveAttribute('light');
    expect(container.querySelector('div.rc-select-item')).toHaveAttribute('data-test', 'good');
    expect(container.querySelector('div.rc-select-item')).toHaveAttribute('aria-label', 'well');
  });

  // https://github.com/ant-design/ant-design/issues/37591
  describe('title attr', () => {
    it('single', () => {
      const { container } = render(
        <Select value="b" options={[{ label: 'bamboo', title: 'TitleBamboo', value: 'b' }]} />,
      );

      // expect(container.find('.rc-select-selection-item').prop('title')).toEqual('TitleBamboo');
      expect(container.querySelector('.rc-select-selection-item').getAttribute('title')).toEqual(
        'TitleBamboo',
      );
    });

    it('multiple', () => {
      const { container } = render(
        <Select
          mode="multiple"
          value={['b', 'l', 'r']}
          maxTagCount={2}
          options={[
            { label: 'bamboo', title: 'TitleBamboo', value: 'b' },
            { label: 'little', value: 'l' },
            { label: 'Rest', value: 'r' },
          ]}
        />,
      );

      expect(
        container.querySelectorAll('span.rc-select-selection-item')[0].getAttribute('title'),
      ).toEqual('TitleBamboo');
      expect(
        container.querySelectorAll('span.rc-select-selection-item')[1].getAttribute('title'),
      ).toEqual('little');
      expect(
        container.querySelectorAll('span.rc-select-selection-item')[2].getAttribute('title'),
      ).toEqual('+ 1 ...');
    });
  });

  it('should be focused when click clear button', () => {
    jest.useFakeTimers();

    const mouseDownPreventDefault = jest.fn();
    const { container } = render(
      <Select allowClear value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(container.querySelector('.rc-select-clear-icon')).toBeTruthy();

    const mouseDownEvent = createEvent.mouseDown(container.querySelector('.rc-select-clear-icon'));
    mouseDownEvent.preventDefault = mouseDownPreventDefault;
    fireEvent(container.querySelector('.rc-select-clear-icon'), mouseDownEvent);
    jest.runAllTimers();

    expect(container.querySelector('.rc-select').className).toContain('-focused');
    jest.useRealTimers();
  });

  it('should support title', () => {
    const { container: container1 } = render(<Select defaultValue="lucy" options={[]} />);
    expect(container1.querySelector('.rc-select').getAttribute('title')).toBeFalsy();
    expect(container1.querySelector('.rc-select-selection-item').getAttribute('title')).toBe(
      'lucy',
    );
    const { container: container2 } = render(<Select defaultValue="lucy" options={[]} title="" />);
    expect(container2.querySelector('.rc-select').getAttribute('title')).toBeFalsy();
    expect(container2.querySelector('.rc-select-selection-item').getAttribute('title')).toBe('');
    const { container: container3 } = render(
      <Select defaultValue="lucy" options={[]} title="title" />,
    );
    expect(container3.querySelector('.rc-select').getAttribute('title')).toBe('title');
    expect(container3.querySelector('.rc-select-selection-item').getAttribute('title')).toBe(
      'title',
    );
  });

  it('scrollbar should be left position with rtl direction', () => {
    const options = new Array(10).fill(null).map((_, value) => ({ value }));

    const { container } = testingRender(<Select open direction="rtl" options={options} />);
    expect(container.querySelector('.rc-virtual-list-rtl')).toBeTruthy();
  });

  it('Should optionRender work', () => {
    const options = [
      { label: 'test1', value: '1' },
      { label: 'test2', value: '2' },
    ];

    const { container } = testingRender(
      <Select
        open
        options={options}
        optionRender={(option, { index }) => {
          return `${option.label} - ${index}`;
        }}
      />,
    );
    expect(container.querySelector('.rc-select-item-option-content').innerHTML).toEqual(
      'test1 - 0',
    );
  });

  it('labelRender', () => {
    const onLabelRender = jest.fn();
    const labelRender = (props: LabelInValueType) => {
      const { label, value } = props;
      onLabelRender();
      return `${label}-${value}`;
    };
    const { container } = render(
      <Select options={[{ label: 'realLabel', value: 'a' }]} value="a" labelRender={labelRender} />,
    );

    expect(onLabelRender).toHaveBeenCalled();
    expect(findSelection(container).textContent).toEqual('realLabel-a');
  });

  it('labelRender when value is not in options', () => {
    const onLabelRender = jest.fn();
    const options = [{ label: 'realLabel', value: 'b' }];
    const labelRender = (props: LabelInValueType) => {
      const { label, value } = props;
      // current value is in options
      if (options.find((item) => item.value === value)) {
        return label;
      } else {
        // current value is not in options
        onLabelRender();
        return `${label || 'fakeLabel'}-${value}`;
      }
    };
    const { container } = render(<Select value="a" labelRender={labelRender} options={options} />);

    expect(onLabelRender).toHaveBeenCalled();
    expect(findSelection(container).textContent).toEqual('fakeLabel-a');
  });

  it('labelRender when labelInValue and useCache', () => {
    const onLabelRender = jest.fn();
    const labelRender = (props: LabelInValueType) => {
      const { label, value } = props;
      onLabelRender({ label, value });
      return `custom label`;
    };

    const renderDemo = (props?: any) => (
      <Select
        labelInValue
        value={{ key: 1, label: 'One' }}
        labelRender={labelRender}
        options={[
          {
            value: 2,
            label: 'Two',
          },
        ]}
        {...props}
      />
    );

    const { container, rerender } = render(renderDemo());

    expect(onLabelRender).toHaveBeenCalledWith({ label: 'One', value: 1 });
    expect(findSelection(container).textContent).toEqual('custom label');

    rerender(renderDemo({ options: [] }));
    expect(findSelection(container).textContent).toEqual('custom label');
  });

  it('multiple items should not disabled', () => {
    const { container } = testingRender(
      <Select
        open
        maxCount={1}
        mode="multiple"
        value={['bamboo']}
        options={[{ value: 'bamboo' }, { value: 'light' }]}
      />,
    );
    const element = container.querySelectorAll<HTMLDivElement>(
      'div.rc-virtual-list-holder-inner .rc-select-item',
    );
    expect(element[0]).not.toHaveClass('rc-select-item-option-disabled');
    expect(element[1]).toHaveClass('rc-select-item-option-disabled');
  });
});
