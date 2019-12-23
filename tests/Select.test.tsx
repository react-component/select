import { mount, render } from 'enzyme';
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
import { INTERNAL_PROPS_MARK } from '../src/interface/generator';

describe('Select.Basic', () => {
  injectRunAllTimers(jest);

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
          showArrow
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
      const wrapper = render(genSelect());
      expect(wrapper).toMatchSnapshot();
    });

    it('renders dropdown correctly', () => {
      const wrapper = render(genSelect({ open: true }));
      expect(wrapper).toMatchSnapshot();
    });

    it('renders disabled select correctly', () => {
      const wrapper = render(genSelect({ disabled: true }));
      expect(wrapper).toMatchSnapshot();
    });

    it('renders data-attributes correctly', () => {
      const wrapper = render(
        genSelect({
          'data-test': 'test-id',
          'data-id': '12345',
        } as any),
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('renders aria-attributes correctly', () => {
      const wrapper = render(
        genSelect({
          'aria-labelledby': 'test-id',
          'aria-label': 'some-label',
        }),
      );
      expect(wrapper).toMatchSnapshot();
    });

    // [Legacy] Should not use `role` since it's meaningless
    it('renders role prop correctly', () => {
      const wrapper = render(
        genSelect({
          role: 'button',
        } as any),
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  it('convert value to array', () => {
    const wrapper = mount(
      <Select value="1" optionLabelProp="children">
        <OptGroup>
          <Option value="1" title="一">
            1-label
          </Option>
        </OptGroup>
      </Select>,
    );

    expect(wrapper.find('Selector').props().values).toEqual([
      expect.objectContaining({ label: '1-label', value: '1' }),
    ]);
    expect(findSelection(wrapper).text()).toEqual('1-label');
  });

  it('convert defaultValue to array', () => {
    const wrapper = mount(
      <Select defaultValue="1">
        <OptGroup>
          <Option value="1" title="一">
            1
          </Option>
        </OptGroup>
      </Select>,
    );
    expect(wrapper.find('Selector').props().values).toEqual([
      expect.objectContaining({ value: '1' }),
    ]);
    expect(findSelection(wrapper).text()).toEqual('1');
  });

  it('not add open className when result is empty and no notFoundContent given', () => {
    const wrapper = mount(<Select mode="combobox" notFoundContent={false} />);
    toggleOpen(wrapper);
    expectOpen(wrapper, false);
  });

  it('should show empty class', () => {
    const wrapper1 = mount(
      <Select open>
        <Select.Option value="bamboo">Bamboo</Select.Option>
      </Select>,
    );
    expect(
      wrapper1
        .find('.rc-select-dropdown')
        .first()
        .hasClass('rc-select-dropdown-empty'),
    ).toBeFalsy();

    const wrapper2 = mount(<Select open />);
    expect(
      wrapper2
        .find('.rc-select-dropdown')
        .first()
        .hasClass('rc-select-dropdown-empty'),
    ).toBeTruthy();
  });

  it('should default select the right option', () => {
    const wrapper = mount(
      <Select defaultValue="2">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    toggleOpen(wrapper);
    expect(
      wrapper
        .find(
          '.rc-select-item-option-selected div.rc-select-item-option-content',
        )
        .text(),
    ).toBe('2');
  });

  it('should can select multiple items', () => {
    const wrapper = mount(
      <Select mode="multiple" value={['1', '2']}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">2</Option>
      </Select>,
    );
    toggleOpen(wrapper);
    expect(
      wrapper
        .find(
          '.rc-select-item-option-selected div.rc-select-item-option-content',
        )
        .map(node => node.text()),
    ).toEqual(['1', '2']);
  });

  it('should hide clear button', () => {
    const wrapper1 = mount(
      <Select allowClear value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    expect(wrapper1.find('.rc-select-clear-icon').length).toBeTruthy();

    const wrapper2 = mount(
      <Select allowClear>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    expect(wrapper2.find('.rc-select-clear-icon').length).toBeFalsy();
  });

  it('should not response click event when select is disabled', () => {
    const wrapper = mount(
      <Select disabled defaultValue="2">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    toggleOpen(wrapper);
    expectOpen(wrapper, false);
  });

  it('should show selected value in singleMode when close', () => {
    const wrapper = mount(
      <Select value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(findSelection(wrapper).text()).toBe('1');
  });

  it('filter options by "value" prop by default', () => {
    const wrapper = mount(
      <Select showSearch>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>,
    );

    wrapper.find('input').simulate('change', { target: { value: '1' } });
    expect(wrapper.find('List').props().data.length).toBe(1);
    expect(wrapper.find('div.rc-select-item-option-content').text()).toBe(
      'One',
    );
  });

  it('should filter options when filterOption is true', () => {
    const wrapper = mount(
      <Select showSearch filterOption>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>,
    );

    wrapper.find('input').simulate('change', { target: { value: '2' } });
    expect(wrapper.find('List').props().data.length).toBe(1);
    expect(wrapper.find('div.rc-select-item-option-content').text()).toBe(
      'Two',
    );
  });

  it('should not filter options when filterOption is false', () => {
    const wrapper = mount(
      <Select filterOption={false}>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>,
    );

    wrapper.find('input').simulate('change', { target: { value: '1' } });
    expect(wrapper.find('List').props().data.length).toBe(2);
  });

  it('specify which prop to filter', () => {
    const wrapper = mount(
      <Select optionFilterProp="label" showSearch>
        <Option value="1" label="One">
          1
        </Option>
        <Option value="2" label="Two">
          2
        </Option>
      </Select>,
    );

    wrapper.find('input').simulate('change', { target: { value: 'Two' } });

    expect(wrapper.find('List').props().data.length).toBe(1);
    expect(wrapper.find('div.rc-select-item-option-content').text()).toBe('2');
  });

  it('filter array children', () => {
    const wrapper = mount(
      <Select optionFilterProp="children" showSearch>
        <Option value="1" label="One">
          One{1}
        </Option>
        <Option value="2" label="Two">
          Two{2}
        </Option>
      </Select>,
    );

    wrapper.find('input').simulate('change', { target: { value: 'Two2' } });

    expect(wrapper.find('List').props().data.length).toBe(1);
    expect(wrapper.find('div.rc-select-item-option-content').text()).toBe(
      'Two2',
    );
  });

  it('no search', () => {
    const wrapper = render(
      <Select showSearch={false} value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should contain falsy children', () => {
    const wrapper = render(
      <Select value="1" open>
        <Option value="1">1</Option>
        {null}
        <Option value="2">2</Option>
        {false}
      </Select>,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('open dropdown on down key press', () => {
    const wrapper = mount(
      <Select value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    wrapper.find('input').simulate('keyDown', { keyCode: 40 });
    expectOpen(wrapper);
  });

  it('clears value', () => {
    const handleChange = jest.fn();
    const onClear = jest.fn();

    const wrapper = mount(
      <Select
        value="1"
        allowClear
        onChange={handleChange}
        internalProps={{
          mark: INTERNAL_PROPS_MARK,
          onClear,
        }}
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    wrapper.find('input').simulate('change', { target: { value: 'foo' } });

    // disabled
    wrapper.setProps({ disabled: true });
    expect(wrapper.find('.rc-select-clear')).toHaveLength(0);

    // enabled
    wrapper.setProps({ disabled: false });
    wrapper
      .find('.rc-select-clear')
      .last()
      .simulate('mousedown');
    expect(handleChange).toHaveBeenCalledWith(undefined, undefined);
    expect(wrapper.find('input').props().value).toEqual('');
    expect(onClear).toHaveBeenCalled();
  });

  it('adds label to value', () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      <Select onChange={handleChange} labelInValue optionLabelProp="children">
        <Option value="1" testprop="test">
          One
        </Option>
        <Option value="2">Two</Option>
      </Select>,
    );

    toggleOpen(wrapper);
    selectItem(wrapper);
    expect(handleChange).toHaveBeenCalledWith(
      { key: '1', value: '1', label: 'One' },
      { children: 'One', key: null, testprop: 'test', value: '1' },
    );
  });

  it('give right option when use OptGroup', () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      <Select onChange={handleChange} labelInValue optionLabelProp="children">
        <OptGroup label="grouplabel">
          <Option value="1" testprop="test">
            One
          </Option>
        </OptGroup>
        <Option value="2">Two</Option>
      </Select>,
    );

    toggleOpen(wrapper);
    selectItem(wrapper);
    expect(handleChange).toHaveBeenCalledWith(
      { key: '1', label: 'One', value: '1' },
      { children: 'One', key: null, testprop: 'test', value: '1' },
    );
  });

  it('use label in props.value', () => {
    const wrapper = mount(
      <Select labelInValue value={{ key: 1, label: 'One' }}>
        <Option value="2">Two</Option>
      </Select>,
    );
    expect(findSelection(wrapper).text()).toEqual('One');
  });

  it('use label in props.defaultValue', () => {
    const wrapper = mount(
      <Select labelInValue defaultValue={{ key: 1, label: 'One' }}>
        <Option value="2">Two</Option>
      </Select>,
    );
    expect(findSelection(wrapper).text()).toEqual('One');
  });

  it('fires search event when user input', () => {
    const handleSearch = jest.fn();
    const wrapper = mount(
      <Select showSearch onSearch={handleSearch}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    wrapper.find('input').simulate('change', { target: { value: '1' } });
    expect(handleSearch).toHaveBeenCalledWith('1');
  });

  it('not fires search event when user select', () => {
    const handleSearch = jest.fn();
    const wrapper = mount(
      <Select showSearch onSearch={handleSearch}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    toggleOpen(wrapper);
    selectItem(wrapper);
    expect(handleSearch).not.toHaveBeenCalled();
  });

  // Should always trigger search event:
  // https://github.com/ant-design/ant-design/issues/16223
  // https://github.com/ant-design/ant-design/issues/10817
  it('should also fires extra search event when user search and select', () => {
    jest.useFakeTimers();

    const handleSearch = jest.fn();
    const wrapper = mount(
      <Select showSearch onSearch={handleSearch}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );
    wrapper.find('input').simulate('change', { target: { value: '1' } });
    expect(handleSearch).toHaveBeenCalledTimes(1);

    // Not fire onSearch when value selected
    // https://github.com/ant-design/ant-design/pull/16235#issuecomment-487506523
    selectItem(wrapper);
    expect(handleSearch).toHaveBeenCalledTimes(1);

    // Should trigger onBlur
    wrapper.find('input').simulate('change', { target: { value: '3' } });
    expect(handleSearch).toHaveBeenCalledTimes(2);
    wrapper.find('input').simulate('blur');
    jest.runAllTimers();
    expect(handleSearch).toHaveBeenCalledTimes(3);

    jest.useRealTimers();
  });

  describe('focus', () => {
    let handleFocus;
    let wrapper;
    beforeEach(() => {
      jest.useFakeTimers();
      handleFocus = jest.fn();
      wrapper = mount(
        <Select onFocus={handleFocus} showSearch={false}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      );

      wrapper.find('input').simulate('focus');
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
      expect(wrapper.find('.rc-select').getDOMNode().className).toContain(
        '-focus',
      );
    });
  });

  describe('click input will trigger focus', () => {
    let handleFocus;
    let wrapper;
    beforeEach(() => {
      jest.useFakeTimers();
      handleFocus = jest.fn();
      wrapper = mount(
        <Select onFocus={handleFocus}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      );

      const focusSpy = jest.spyOn(wrapper.find('input').instance(), 'focus');

      wrapper.find('.rc-select-selector').simulate('click');
      expect(focusSpy).toHaveBeenCalled();

      // We should mock trigger focus event since it not work in jsdom
      wrapper.find('input').simulate('focus');
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
      expect(wrapper.find('.rc-select').getDOMNode().className).toContain(
        '-focus',
      );
    });

    it('click placeholder should trigger onFocus', () => {
      const wrapper2 = mount(
        <Select placeholder="xxxx">
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      );

      const inputSpy = jest.spyOn(wrapper2.find('input').instance(), 'focus');

      wrapper2.find('.rc-select-selection-placeholder').simulate('click');
      expect(inputSpy).toHaveBeenCalled();
    });
  });

  describe('blur', () => {
    let handleChange;
    let handleBlur;
    let wrapper;

    beforeEach(() => {
      jest.useFakeTimers();

      handleChange = jest.fn();
      handleBlur = jest.fn();
      wrapper = mount(
        <Select
          onChange={handleChange}
          onBlur={handleBlur}
          showSearch
          optionLabelProp="children"
        >
          <Option value={1} key={1}>
            1-text
          </Option>
          <Option value={2} key={2}>
            2-text
          </Option>
        </Select>,
      );

      wrapper.find('input').simulate('focus');
      wrapper.find('input').simulate('change', { target: { value: '1' } });
      wrapper.find('input').simulate('blur');

      jest.runAllTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('fires blur event', () => {
      expect(handleBlur).toHaveBeenCalled();
    });

    it('set className', () => {
      expect(wrapper.find('.rc-select').getDOMNode().className).not.toContain(
        '-focus',
      );
    });

    // Fix https://github.com/ant-design/ant-design/issues/6342
    it('should be close when blur Select[showSearch=false]', () => {
      wrapper = mount(
        <Select showSearch={false}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      );
      toggleOpen(wrapper);
      wrapper.find('input').simulate('blur');
      jest.runAllTimers();
      wrapper.update();
      expectOpen(wrapper, false);
    });

    // Fix https://github.com/ant-design/ant-design/issues/7720
    it('should not trigger onFocus/onBlur when select is disabled', () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      wrapper = mount(
        <Select onFocus={onFocus} onBlur={onBlur} disabled>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
      );
      jest.useFakeTimers();
      wrapper.find('input').simulate('focus');
      wrapper.find('input').simulate('blur');
      jest.runAllTimers();
      expect(onFocus).not.toHaveBeenCalled();
      expect(onBlur).not.toHaveBeenCalled();
    });
  });

  [KeyCode.ENTER, KeyCode.DOWN].forEach(keyCode => {
    it('open on key press', () => {
      const wrapper = mount(<Select />);
      wrapper.find('input').simulate('keyDown', { keyCode });
      expectOpen(wrapper);
    });
  });

  it('close on ESC', () => {
    const wrapper = mount(<Select />);
    toggleOpen(wrapper);
    wrapper
      .find('input')
      .simulate('change', { target: { value: 'foo' } })
      .simulate('keyDown', { which: KeyCode.ESC });

    wrapper.update();

    expect(wrapper.find('input').props().value).toBe('');
    expectOpen(wrapper, false);
  });

  it('close after select', () => {
    const wrapper = mount(
      <Select>
        <Option value="1">1</Option>
      </Select>,
    );

    toggleOpen(wrapper);
    expectOpen(wrapper);

    selectItem(wrapper);
    expectOpen(wrapper, false);
  });

  it('Controlled opening', () => {
    const wrapper = mount(
      <Select open>
        <Option value="1">1</Option>
      </Select>,
    );
    expectOpen(wrapper);
    selectItem(wrapper);
    expectOpen(wrapper);

    wrapper.setProps({ open: false });
    expectOpen(wrapper, false);
    selectItem(wrapper);
    expectOpen(wrapper, false);
  });

  it('Controlled onDropdownVisibleChange', () => {
    class Controlled extends React.Component {
      public state = {
        open: true,
      };

      public onDropdownVisibleChange = open => {
        this.setState({ open });
      };

      public render() {
        return (
          <Select
            open={this.state.open}
            onDropdownVisibleChange={this.onDropdownVisibleChange}
          >
            <Option value="1">1</Option>
          </Select>
        );
      }
    }
    const wrapper = mount(<Controlled />);
    expect(wrapper.state().open).toBe(true);
    toggleOpen(wrapper);
    expect(wrapper.state().open).toBe(false);

    selectItem(wrapper);
    expectOpen(wrapper, false);
  });

  it('focus input when placeholder is clicked', () => {
    const wrapper = mount(
      <Select placeholder="select">
        <Option value="1">1</Option>
      </Select>,
    );

    const focusSpy = jest.spyOn(wrapper.find('input').instance(), 'focus');
    wrapper.find('.rc-select-selection-placeholder').simulate('click');

    expect(focusSpy).toHaveBeenCalled();
  });

  it('combobox could customize input element', () => {
    const onKeyDown = jest.fn();
    const onChange = jest.fn();
    const onMouseDown = jest.fn();
    const textareaRef = jest.fn();
    const mouseDownPreventDefault = jest.fn();
    const wrapper = mount(
      <Select
        mode="combobox"
        getInputElement={() => (
          <textarea
            onKeyDown={onKeyDown}
            onChange={onChange}
            onMouseDown={onMouseDown}
            ref={textareaRef}
          />
        )}
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(wrapper.find('textarea').length).toBe(1);
    toggleOpen(wrapper);
    wrapper
      .find('.rc-select')
      .find('textarea')
      .simulate('mouseDown', { preventDefault: mouseDownPreventDefault })
      .simulate('keyDown', { which: KeyCode.NUM_ONE })
      .simulate('change', { value: '1' });

    selectItem(wrapper);
    expect(wrapper.find('textarea').props().value).toEqual('1');
    expect(mouseDownPreventDefault).not.toHaveBeenCalled();
    expect(onKeyDown).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();
    expect(onMouseDown).toHaveBeenCalled();
    expect(textareaRef).toHaveBeenCalled();
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
      mount(<Select labelInValue value="foo" />);
      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: `value` should in shape of `{ value: string | number, label?: ReactNode }` when you set `labelInValue` to `true`',
      );
    });

    it('warns on invalid value when multiple', () => {
      mount(<Select mode="multiple" value="" />);
      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: `value` should be array when `mode` is `multiple` or `tags`',
      );
    });
  });

  it('set label as key for OptGroup', () => {
    const wrapper = mount(
      <Select open>
        <OptGroup key="group1">
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </OptGroup>
      </Select>,
    );

    expect(wrapper.find('.rc-select-item-group').text()).toBe('group1');
  });

  it('filters options by inputValue', () => {
    const wrapper = mount(
      <Select showSearch open>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="11" disabled>
          11
        </Option>
        <Option value="111">111</Option>
      </Select>,
    );

    wrapper.find('input').simulate('change', { target: { value: '1' } });
    expect(wrapper.find('List').props().data).toHaveLength(2);
  });

  it('should include disabled item in options', () => {
    const wrapper = mount(
      <Select mode="tags" open value={['name1']}>
        <Option key="name1" value="name1" disabled>
          name1
        </Option>
        <Option key="name2" value="name2">
          name2
        </Option>
      </Select>,
    );
    expect(wrapper.find('List').props().data).toHaveLength(2);
  });

  it('renders not found when search result is empty', () => {
    const wrapper = mount(
      <Select showSearch open>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    wrapper.find('input').simulate('change', { target: { value: '3' } });
    expect(wrapper.find('OptionList').props().options).toHaveLength(0);
    expect(wrapper.find('.rc-select-item-empty').text()).toEqual('Not Found');
  });

  it('warns on invalid children', () => {
    const Foo = value => <div>foo{value}</div>;
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => null);
    mount(
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
    mount(
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
    const wrapper = mount(
      <Select searchValue="3" showSearch filterOption open>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('does not filter when filterOption value is false', () => {
    const wrapper = render(
      <Select inputValue="1" filterOption={false} open>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('backfill', () => {
    const triggerQueue: string[] = [];
    const handleChange = jest.fn(() => {
      triggerQueue.push('change');
    });
    const handleSelect = jest.fn(() => {
      triggerQueue.push('select');
    });
    const wrapper = mount(
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

    wrapper.find('input').simulate('keyDown', { which: KeyCode.DOWN });
    wrapper.find('input').simulate('keyDown', { which: KeyCode.DOWN });

    expect(wrapper.find('input').props().value).toEqual('2');
    expect(handleChange).not.toHaveBeenCalled();
    expect(handleSelect).not.toHaveBeenCalled();

    wrapper.find('input').simulate('keyDown', { which: KeyCode.ENTER });

    expect(wrapper.find('input').props().value).toEqual('2');
    expect(handleChange).toHaveBeenCalledWith('2', expect.anything());
    expect(handleSelect).toHaveBeenCalledWith('2', expect.anything());

    expect(triggerQueue).toEqual(['change', 'select']);
  });

  describe('number value', () => {
    it('support number value', () => {
      const handleChange = jest.fn();

      const wrapper = mount(
        <Select defaultValue={1} onChange={handleChange}>
          <Option value={1}>1</Option>
          <Option value={2}>2</Option>
        </Select>,
      );

      expect(findSelection(wrapper).text()).toEqual('1');

      toggleOpen(wrapper);
      selectItem(wrapper, 1);
      expect(handleChange).toHaveBeenCalledWith(2, expect.anything());
      expect(findSelection(wrapper).text()).toEqual('2');
    });

    it('search number value', () => {
      const wrapper = mount(
        <Select showSearch>
          <Option value={1}>1</Option>
          <Option value={2}>2</Option>
        </Select>,
      );

      wrapper.find('input').simulate('change', { target: { value: '1' } });
      expect(wrapper.find('List').props().data.length).toEqual(1);
    });
  });

  it('should render custom dropdown correctly', () => {
    const wrapper = mount(
      <Select
        open
        dropdownRender={menu => (
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
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('should trigger click event in custom node', () => {
    jest.useFakeTimers();

    const onChildClick = jest.fn();
    const onMouseDown = jest.fn();
    const wrapper = mount(
      <Select
        onMouseDown={onMouseDown}
        dropdownRender={menu => (
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

    toggleOpen(wrapper);
    wrapper.find('div#dropdown-custom-node').simulate('mousedown');
    wrapper.find('div#dropdown-custom-node').simulate('click');
    expect(onMouseDown).toHaveBeenCalled();
    expect(onChildClick).toHaveBeenCalled();

    document.body.focus();

    jest.runAllTimers();

    expect(wrapper.find('input').instance()).toBe(document.activeElement);

    jest.useRealTimers();
  });

  it('set showAction', () => {
    const wrapper = mount(
      <Select showAction={['focus']}>
        <Option value="1">1</Option>
      </Select>,
    );

    expectOpen(wrapper, false);
    wrapper.find('.rc-select').simulate('focus');

    expectOpen(wrapper);
  });

  it('default filterOption is case insensitive', () => {
    const wrapper = mount(
      <Select showSearch>
        <Option value="ABC">ABC</Option>
        <Option value="DEF">DEF</Option>
      </Select>,
    );

    wrapper.find('input').simulate('change', { target: { value: 'b' } });
    expect(wrapper.find('List').props().data).toHaveLength(1);
    expect(wrapper.find('div.rc-select-item-option-content').text()).toBe(
      'ABC',
    );
  });

  it('accepts prop id', () => {
    const wrapper = mount(
      <Select id="my-select">
        <Option value="1">One</Option>
      </Select>,
    );

    expect(wrapper.find('input#my-select').length).toBeTruthy();
  });

  it('not select first option when no result', () => {
    const handleSelect = jest.fn();
    const wrapper = mount(
      <Select
        defaultActiveFirstOption
        filterOption={(inputValue, option) =>
          (option.children as string)
            .toUpperCase()
            .indexOf(inputValue.toUpperCase()) !== -1
        }
        onSelect={handleSelect}
        showSearch
      >
        <Option value="Burns Bay Road">Burns Bay Road</Option>
        <Option value="Downing Street">Downing Street</Option>
        <Option value="Wall Street">Wall Street</Option>
      </Select>,
    );

    wrapper.find('input').simulate('change', { target: { value: 'b' } });
    expect(wrapper.find('input').props().value).toBe('b');
    expect(wrapper.find('List').props().data).toHaveLength(1);
    expect(wrapper.find('div.rc-select-item-option-content').text()).toBe(
      'Burns Bay Road',
    );

    wrapper.find('input').simulate('change', { target: { value: 'c' } });
    expect(wrapper.find('input').props().value).toBe('c');
    expect(wrapper.find('OptionList').props().options).toHaveLength(0);
    expect(wrapper.find('.rc-select-item-empty').text()).toEqual('Not Found');

    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.ENTER });
    expect(wrapper.find('input').props().value).toBe('c');
    expect(handleSelect).not.toHaveBeenCalled();
  });

  // https://github.com/ant-design/ant-design/issues/12172
  it('onChange trigger only once when value is 0', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Select onChange={onChange}>
        <Option value={0}>0</Option>
      </Select>,
    );

    toggleOpen(wrapper);
    selectItem(wrapper);
    expect(onChange).toHaveBeenCalled();

    onChange.mockReset();

    toggleOpen(wrapper);
    selectItem(wrapper);
    expect(onChange).not.toHaveBeenCalled();
  });

  // https://github.com/ant-design/ant-design/issues/12260
  it('dropdown menu width should not be smaller than trigger even dropdownMatchSelectWidth is false', () => {
    const wrapper = mount(
      <Select style={{ width: 1000 }} dropdownMatchSelectWidth={233}>
        <Option value={0}>0</Option>
        <Option value={1}>1</Option>
      </Select>,
    );
    toggleOpen(wrapper);
    expect(
      wrapper
        .find('.rc-select-dropdown')
        .last()
        .props().style.width,
    ).toBe(233);
  });

  it('if loading, arrow should show loading icon', () => {
    const wrapper = mount(
      <Select style={{ width: 1000 }} loading>
        <Option value={0}>0</Option>
        <Option value={1}>1</Option>
      </Select>,
    );
    expect(wrapper.find('.rc-select-arrow-loading').length).toBeTruthy();
  });
  it('if loading and multiple which has not arrow, but have loading icon', () => {
    const wrapper = mount(
      <Select style={{ width: 1000 }} mode="multiple">
        <Option value={0}>0</Option>
        <Option value={1}>1</Option>
      </Select>,
    );
    expect(wrapper.find('.rc-select-arrow-icon').length).toBeFalsy();
    expect(wrapper.find('.rc-select-arrow-loading').length).toBeFalsy();

    wrapper.setProps({
      loading: true,
    });
    expect(wrapper.find('.rc-select-arrow-loading').length).toBeTruthy();
  });

  it('should keep trigger onSelect by select', () => {
    const onSelect = jest.fn();
    const wrapper = mount(
      <Select open onSelect={onSelect} optionLabelProp="children">
        <Option value="1">One</Option>
      </Select>,
    );

    for (let i = 0; i < 10; i += 1) {
      onSelect.mockReset();
      wrapper.find('input').simulate('keyDown', { which: KeyCode.ENTER });
      expect(onSelect).toHaveBeenCalledWith('1', expect.anything());
    }
  });

  it('should warning using `onSearch` if not set `showSearch`', () => {
    resetWarned();
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => null);

    mount(<Select onSearch={jest.fn()} />);
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `onSearch` should work with `showSearch` instead of use alone.',
    );

    errorSpy.mockRestore();
  });

  it('dropdown selection item customize icon', () => {
    const menuItemSelectedIcon = jest.fn();
    mount(
      <Select
        value="1"
        options={[{ value: '1' }]}
        open
        menuItemSelectedIcon={menuItemSelectedIcon}
      />,
    );

    expect(menuItemSelectedIcon).toHaveBeenCalledWith({ isSelected: true });
  });

  it('keyDown & KeyUp event', () => {
    const onKeyDown = jest.fn();
    const onKeyUp = jest.fn();
    const wrapper = mount(<Select onKeyDown={onKeyDown} onKeyUp={onKeyUp} />);

    wrapper.find('input').simulate('keydown', { which: KeyCode.ENTER });
    expectOpen(wrapper);
    expect(onKeyDown).toHaveBeenCalled();

    wrapper.find('input').simulate('keyup', { which: KeyCode.ENTER });
    expect(onKeyUp).toHaveBeenCalled();
  });

  it('warning if label not same as option', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount(
      <Select value={{ value: '2', label: 'One' }} labelInValue>
        <Option value="2">Two</Option>
      </Select>,
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `label` of `value` is not same as `label` in Select options.',
    );
    errorSpy.mockRestore();
  });

  describe('warning if use `props` to read data', () => {
    it('filterOption', () => {
      resetWarned();
      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const wrapper = mount(
        <Select
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          showSearch
        >
          <Option value="light">Light</Option>
          <Option value="bamboo">Bamboo</Option>
        </Select>,
      );

      wrapper.find('input').simulate('change', { target: { value: 'l' } });
      expect(wrapper.find('List').props().data).toHaveLength(1);
      expect(wrapper.find('div.rc-select-item-option-content').text()).toBe(
        'Light',
      );

      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: Return type is option instead of Option instance. Please read value directly instead of reading from `props`.',
      );
      errorSpy.mockRestore();
    });

    it('Select & Deselect', () => {
      resetWarned();
      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const readPropsFunc = (_, opt) => {
        expect(opt.props).toBeTruthy();
      };

      // We also test if internal hooks work here.
      // Can be remove if not need in `rc-tree-select` anymore.
      const onRawSelect = jest.fn();
      const onRawDeselect = jest.fn();

      const wrapper = mount(
        <Select
          mode="multiple"
          onSelect={readPropsFunc}
          onDeselect={readPropsFunc}
          internalProps={{
            mark: INTERNAL_PROPS_MARK,
            onRawSelect,
            onRawDeselect,
          }}
        >
          <Option value="light">Light</Option>
          <Option value="bamboo">Bamboo</Option>
        </Select>,
      );

      toggleOpen(wrapper);
      selectItem(wrapper);
      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: Return type is option instead of Option instance. Please read value directly instead of reading from `props`.',
      );
      expect(onRawSelect).toHaveBeenCalled();

      errorSpy.mockReset();
      resetWarned();
      selectItem(wrapper);
      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: Return type is option instead of Option instance. Please read value directly instead of reading from `props`.',
      );
      expect(onRawDeselect).toHaveBeenCalled();

      errorSpy.mockRestore();
    });

    it('onChange', () => {
      resetWarned();
      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const readPropsFunc = (_, opt) => {
        expect(opt.props).toBeTruthy();
      };

      const wrapper = mount(
        <Select onChange={readPropsFunc}>
          <Option value="light">Light</Option>
          <Option value="bamboo">Bamboo</Option>
        </Select>,
      );

      toggleOpen(wrapper);
      selectItem(wrapper);
      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: Return type is option instead of Option instance. Please read value directly instead of reading from `props`.',
      );

      errorSpy.mockRestore();
    });

    // This test case can be safe remove
    it('skip onChange', () => {
      const onChange = jest.fn();
      const wrapper = mount(
        <Select
          onChange={onChange}
          internalProps={{ mark: INTERNAL_PROPS_MARK, skipTriggerChange: true }}
        >
          <Option value="light">Light</Option>
          <Option value="bamboo">Bamboo</Option>
        </Select>,
      );

      toggleOpen(wrapper);
      selectItem(wrapper);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it('not crash when options is null', () => {
    mount(<Select options={null} />);
  });

  it('not open when `notFoundCount` is empty & no data', () => {
    const wrapper = mount(
      <Select options={null} notFoundContent={null} open showSearch />,
    );
    expect(wrapper.find('SelectTrigger').props().visible).toBeFalsy();
    expect(wrapper.find('Input').props().editable).toBeTruthy();
  });

  it('click outside to close select', () => {
    const wrapper = mount(
      <Select>
        <Option value="1">One</Option>
      </Select>,
    );

    toggleOpen(wrapper);

    const clickEvent = new Event('mousedown');
    Object.defineProperty(clickEvent, 'target', {
      get: () => document.body,
    });
    act(() => {
      window.dispatchEvent(clickEvent);
    });
    wrapper.update();

    expectOpen(wrapper, false);

    wrapper.unmount();
  });

  it('search should not work when `showSearch` is false', () => {
    const wrapper = mount(
      <Select open>
        <Option value="1">One</Option>
      </Select>,
    );

    wrapper.find('input').simulate('change', 'Z');
    expect(wrapper.find('List').props().data).toHaveLength(1);
  });
});
