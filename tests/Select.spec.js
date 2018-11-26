/* eslint-disable no-undef */
import React from 'react';
import { mount, render } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import Select, { Option, OptGroup } from '../src';
import focusTest from './shared/focusTest';
import blurTest from './shared/blurTest';
import keyDownTest from './shared/keyDownTest';
import inputFilterTest from './shared/inputFilterTest';
import openControlledTest from './shared/openControlledTest';

describe('Select', () => {
  focusTest('single');
  blurTest('single');
  keyDownTest('single');
  inputFilterTest('single');
  openControlledTest('single');

  describe('render', () => {
    const select = (
      <Select
        prefixCls="antd"
        className="select-test"
        openClassName="open-test"
        value="2"
        placeholder="Select a number"
        showArrow
        allowClear
        showSearch
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

    it('renders correctly', () => {
      const wrapper = render(select);
      expect(wrapper).toMatchSnapshot();
    });

    it('renders dropdown correctly', () => {
      const wrapper = render(React.cloneElement(select, { open: true }));
      expect(wrapper).toMatchSnapshot();
    });

    it('renders disabeld select correctly', () => {
      const wrapper = render(React.cloneElement(select, { disabled: true }));
      expect(wrapper).toMatchSnapshot();
    });

    it('renders data-attributes correctly', () => {
      const wrapper = render(React.cloneElement(select, {
        'data-test': 'test-id',
        'data-id': '12345',
      }));
      expect(wrapper).toMatchSnapshot();
    });

    it('renders aria-attributes correctly', () => {
      const wrapper = render(React.cloneElement(select, {
        'aria-labelledby': 'test-id',
        'aria-label': 'some-label',
      }));
      expect(wrapper).toMatchSnapshot();
    });

    it('renders role prop correctly', () => {
      const wrapper = render(React.cloneElement(select, {
        role: 'button',
      }));
      expect(wrapper).toMatchSnapshot();
    });
  });

  it('convert value to array', () => {
    const wrapper = mount(
      <Select value="1" optionLabelProp="children">
        <OptGroup>
          <Option value="1" title="一">1-label</Option>
        </OptGroup>
      </Select>
    );
    expect(wrapper.state().value).toEqual(['1']);
    expect(wrapper.find('.rc-select-selection-selected-value').text()).toEqual('1-label');
    expect(wrapper.find('.rc-select-selection-selected-value').prop('title')).toEqual('一');
  });

  it('convert defaultValue to array', () => {
    const wrapper = mount(
      <Select defaultValue="1">
        <OptGroup>
          <Option value="1" title="一">1</Option>
        </OptGroup>
      </Select>
    );
    expect(wrapper.state().value).toEqual(['1']);
    expect(wrapper.find('.rc-select-selection-selected-value').text()).toEqual('1');
    expect(wrapper.find('.rc-select-selection-selected-value').prop('title')).toEqual('一');
  });

  it('not add open className when result is empty and no notFoundContent given', () => {
    const wrapper = mount(
      <Select combobox notFoundContent={false} />
    );
    const select = wrapper.find('.rc-select');
    select.simulate('click');
    expect(select.props().className).not.toContain('-open');
  });

  it('should default select the right option', () => {
    const wrapper = mount(
      <Select defaultValue="2">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );
    wrapper.find('.rc-select').simulate('click');
    expect(wrapper.find('Menu').props().selectedKeys).toEqual(['2']);
  });

  it('should can select multiple items', () => {
    const wrapper = mount(
      <Select multiple value={['1', '2']}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">2</Option>
      </Select>
    );
    wrapper.find('.rc-select').simulate('click');
    expect(wrapper.find('Menu').props().selectedKeys).toEqual(['1', '2']);
  });

  it('should hide clear button', () => {
    const wrapper = mount(
      <Select allowClear>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );
    expect(wrapper.find('.rc-select-selection__clear').length).toBe(0);
  });

  it('should not response click event when select is disabled', () => {
    const wrapper = mount(
      <Select disabled defaultValue="2">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );
    wrapper.find('.rc-select').simulate('click');
    expect(wrapper.state().open).toBe(false);
  });

  it('should show selected value in singleMode when close', () => {
    const wrapper = mount(
      <Select value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    expect(wrapper.find('.rc-select-selection-selected-value').props().children).toBe('1');
  });

  it('filter options by "value" prop by default', () => {
    const wrapper = mount(
      <Select>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>
    );

    wrapper.find('input').simulate('change', { target: { value: '1' } });
    expect(wrapper.find('MenuItem').length).toBe(1);
    expect(wrapper.find('MenuItem').props().value).toBe('1');
  });

  it('should filter options when filterOption is true', () => {
    const wrapper = mount(
      <Select filterOption>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>
    );

    wrapper.find('input').simulate('change', { target: { value: '2' } });
    expect(wrapper.find('MenuItem').length).toBe(1);
    expect(wrapper.find('MenuItem').props().value).toBe('2');
  });

  it('should not filter options when filterOption is false', () => {
    const wrapper = mount(
      <Select filterOption={false}>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>
    );

    wrapper.find('input').simulate('change', { target: { value: '1' } });
    expect(wrapper.find('MenuItem').length).toBe(2);
  });

  it('specify which prop to filter', () => {
    const wrapper = mount(
      <Select optionFilterProp="label">
        <Option value="1" label="One">1</Option>
        <Option value="2" label="Two">2</Option>
      </Select>
    );

    wrapper.find('input').simulate('change', { target: { value: 'Two' } });

    expect(wrapper.find('MenuItem').length).toBe(1);
    expect(wrapper.find('MenuItem').props().value).toBe('2');
  });

  it('filter array children', () => {
    const wrapper = mount(
      <Select optionFilterProp="children">
        <Option value="1" label="One">One{1}</Option>
        <Option value="2" label="Two">Two{2}</Option>
      </Select>
    );

    wrapper.find('input').simulate('change', { target: { value: 'Two2' } });

    expect(wrapper.find('MenuItem').length).toBe(1);
    expect(wrapper.find('MenuItem').props().value).toBe('2');
  });

  it('no search', () => {
    const wrapper = render(
      <Select showSearch={false} value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should contian falsy children', () => {
    const wrapper = render(
      <Select value="1">
        <Option value="1">1</Option>
        {null}
        <Option value="2">2</Option>
        {false}
      </Select>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('open dropdown on down key press', () => {
    const wrapper = mount(
      <Select value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    wrapper.find('input').simulate('keyDown', { keyCode: 40 });
    expect(wrapper.state().open).toBe(true);
  });

  it('clears value', () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      <Select
        value="1"
        allowClear
        onChange={handleChange}
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    wrapper.find('input').simulate('change', { target: { value: 'foo' } });
    wrapper.find('.rc-select-selection__clear').simulate('click');
    expect(handleChange).toBeCalledWith(undefined, undefined);
    expect(wrapper.state().inputValue).toBe('');
  });

  it('adds label to value', () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      <Select
        onChange={handleChange}
        labelInValue
        optionLabelProp="children"
      >
        <Option value="1" testprop="test">One</Option>
        <Option value="2">Two</Option>
      </Select>
    );

    wrapper.find('.rc-select').simulate('click');
    wrapper.find('MenuItem').first().simulate('click');
    expect(handleChange).toBeCalledWith(
      { key: '1', label: 'One' },
      <Option value="1" testprop="test">One</Option>
    );
  });

  it('give right option when use OptGroup', () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      <Select
        onChange={handleChange}
        labelInValue
        optionLabelProp="children"
      >
        <OptGroup label="grouplabel">
          <Option value="1" testprop="test">One</Option>
        </OptGroup>
        <Option value="2">Two</Option>
      </Select>
    );

    wrapper.find('.rc-select').simulate('click');
    wrapper.find('MenuItem').first().simulate('click');
    expect(handleChange).toBeCalledWith(
      { key: '1', label: 'One' },
      <Option value="1" testprop="test">One</Option>
    );
  });

  it('use label in props.value', () => {
    const wrapper = mount(
      <Select labelInValue value={{ key: 1, label: 'One' }}>
        <Option value="2">Two</Option>
      </Select>
    );
    expect(wrapper.find('.rc-select-selection-selected-value').text()).toEqual('One');
  });

  it('fires search event when user input', () => {
    const handleSearch = jest.fn();
    const wrapper = mount(
      <Select
        showSearch
        onSearch={handleSearch}
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    wrapper.find('input').simulate('change', { target: { value: '1' } });
    expect(handleSearch).toBeCalledWith('1');
  });

  it('not fires search event when user select', () => {
    const handleSearch = jest.fn();
    const wrapper = mount(
      <Select
        showSearch
        onSearch={handleSearch}
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );
    wrapper.find('.rc-select').simulate('click');
    wrapper.find('MenuItem').first().simulate('click');
    expect(handleSearch).not.toBeCalled();
  });

  // https://github.com/ant-design/ant-design/issues/10817
  it('not fires extra search event when user search and select', () => {
    const handleSearch = jest.fn();
    const wrapper = mount(
      <Select
        showSearch
        onSearch={handleSearch}
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );
    wrapper.find('input').simulate('change', { target: { value: '1' } });
    wrapper.find('MenuItem').first().simulate('click');
    expect(handleSearch).toHaveBeenCalledTimes(1);
  });


  describe('focus', () => {
    let handleFocus;
    let wrapper;
    beforeEach(() => {
      handleFocus = jest.fn();
      wrapper = mount(
        <Select onFocus={handleFocus}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
      );
      jest.useFakeTimers();
      wrapper.find('.rc-select').simulate('focus');
      jest.runAllTimers();
    });

    it('set _focused to true', () => {
      expect(wrapper.instance()._focused).toBe(true);
    });

    it('fires focus event', () => {
      expect(handleFocus).toBeCalled();
      expect(handleFocus.mock.calls.length).toBe(1);
    });

    it('set className', () => {
      expect(wrapper.find('.rc-select').getDOMNode().className).toContain('-focus');
    });
  });

  describe('click input will trigger focus', () => {
    let handleFocus;
    let wrapper;
    beforeEach(() => {
      handleFocus = jest.fn();
      wrapper = mount(
        <Select onFocus={handleFocus}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
      );
      jest.useFakeTimers();
      wrapper.find('.rc-select input').simulate('click');
      jest.runAllTimers();
    });

    it('set _focused to true', () => {
      expect(wrapper.instance()._focused).toBe(true);
    });

    it('fires focus event', () => {
      expect(handleFocus).toBeCalled();
      expect(handleFocus.mock.calls.length).toBe(1);
    });

    it('set className', () => {
      expect(wrapper.find('.rc-select').getDOMNode().className).toContain('-focus');
    });

    it('click placeholder should trigger onFocus', () => {
      const handleFocus2 = jest.fn();
      const wrapper2 = mount(
        <Select onFocus={handleFocus2} placeholder="xxxx">
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
      );
      jest.useFakeTimers();
      wrapper2.find('.rc-select-selection__placeholder').simulate('click');
      jest.runAllTimers();
      expect(handleFocus2.mock.calls).toHaveLength(1);
      expect(handleFocus2).toBeCalled();
    });
  });

  describe('blur', () => {
    let handleChange;
    let handleBlur;
    let wrapper;

    beforeEach(() => {
      handleChange = jest.fn();
      handleBlur = jest.fn();
      wrapper = mount(
        <Select
          onChange={handleChange}
          onBlur={handleBlur}
          showSearch
          optionLabelProp="children"
        >
          <Option value={1} key={1}>1-text</Option>
          <Option value={2} key={2}>2-text</Option>
        </Select>
      );
      jest.useFakeTimers();
      wrapper.find('input').simulate('change', { target: { value: '1' } });
      wrapper.find('.rc-select').simulate('blur');
      jest.runAllTimers();
    });

    it('will be auto select', () => {
      expect(wrapper.update().find('.rc-select-selection-selected-value').text()).toBe('1-text');
    });

    it('set _focused to false', () => {
      expect(wrapper.instance()._focused).toBe(false);
    });

    it('fires change event', () => {
      expect(handleChange).toBeCalledWith(1, expect.anything());
    });

    it('fires blur event', () => {
      expect(handleBlur).toBeCalled();
    });

    it('set className', () => {
      expect(wrapper.find('.rc-select').getDOMNode().className).not.toContain('-focus');
    });

    // Fix https://github.com/ant-design/ant-design/issues/6342
    it('should be close when blur Select[showSearch=false]', () => {
      wrapper = mount(
        <Select showSearch={false}>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
      );
      wrapper.find('.rc-select').simulate('click');
      expect(wrapper.state().open).toBe(true);
      wrapper.find('.rc-select').simulate('blur');
      jest.runAllTimers();
      expect(wrapper.state().open).toBe(false);
    });

    // Fix https://github.com/ant-design/ant-design/issues/7720
    it('should not trigger onFocus/onBlur when select is disabled', () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      wrapper = mount(
        <Select
          onFocus={onFocus}
          onBlur={onBlur}
          disabled
        >
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
      );
      jest.useFakeTimers();
      wrapper.find('.rc-select').simulate('focus');
      wrapper.find('.rc-select').simulate('blur');
      jest.runAllTimers();
      expect(onFocus).not.toBeCalled();
      expect(onBlur).not.toBeCalled();
    });
  });

  describe('unmount', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
      wrapper = mount(
        <Select>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
      );
      instance = wrapper.instance();
    });

    it('clear blur timer', () => {
      wrapper.find('.rc-select').simulate('blur');

      expect(instance.blurTimer).toBeTruthy();
      instance.componentWillUnmount();
      expect(instance.blurTimer).toBe(null);
    });

    it('clear dropdownContainer', () => {
      instance.getDropdownContainer();

      expect(instance.dropdownContainer).toBeTruthy();
      instance.componentWillUnmount();
      expect(instance.dropdownContainer).toBe(null);
    });
  });

  [KeyCode.ENTER, KeyCode.DOWN].forEach((keyCode) => {
    it('open on key press', () => {
      const wrapper = mount(<Select />);
      wrapper.find('.rc-select-selection').simulate('keyDown', { keyCode });
      expect(wrapper.state().open).toBe(true);
    });
  });

  it('pass event to input', () => {
    const wrapper = mount(<Select showSearch={false} />);
    wrapper.instance().onInputKeyDown = jest.fn();
    wrapper.find('.rc-select').simulate('click');
    wrapper.find('.rc-select-selection').simulate('keyDown');

    expect(wrapper.instance().onInputKeyDown).toBeCalled();
  });

  it('close on ESC', () => {
    const wrapper = mount(<Select />);
    wrapper.find('.rc-select').simulate('click');
    wrapper.find('input')
      .simulate('change', { target: { value: 'foo' } })
      .simulate('keyDown', { keyCode: KeyCode.ESC });

    expect(wrapper.state().inputValue).toBe('');
    // 下面不知道为什么会失败
    // expect(wrapper.state().open).toBe(false);
  });

  it('close after select', () => {
    const wrapper = mount(
      <Select>
        <Option value="1">1</Option>
      </Select>
    );

    wrapper.find('.rc-select').simulate('click');
    expect(wrapper.state().open).toBe(true);

    wrapper.find('MenuItem').simulate('click');
    expect(wrapper.state().open).toBe(false);
  });

  it('open by arrow click', () => {
    const wrapper = mount(
      <Select>
        <Option value="1">1</Option>
      </Select>
    );

    wrapper.find('.rc-select-arrow').simulate('click');
    expect(wrapper.state().open).toBe(true);
  });

  it('Controlled opening', () => {
    const wrapper = mount(
      <Select open>
        <Option value="1">1</Option>
      </Select>
    );
    expect(wrapper.state().open).toBe(true);
    wrapper.find('MenuItem').simulate('click');
    expect(wrapper.state().open).toBe(true);

    wrapper.setProps({ open: false });
    wrapper.find('.rc-select').simulate('click');
    expect(wrapper.state().open).toBe(false);
  });

  it('Controlled onDropdownVisibleChange', () => {
    class Controlled extends React.Component {
      state = {
        open: true,
      };
      onDropdownVisibleChange = open => {
        this.setState({ open });
      };
      render() {
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

    const wrapper = mount(<Controlled/>);
    expect(wrapper.state().open).toBe(true);
    wrapper.find('.rc-select').simulate('click');
    expect(wrapper.state().open).toBe(true);

    wrapper.find('MenuItem').simulate('click');
    expect(wrapper.state().open).toBe(false);
  });

  it('focus input when placeholder is clicked', () => {
    const wrapper = mount(
      <Select placeholder="select">
        <Option value="1">1</Option>
      </Select>
    );

    const input = wrapper.find('input').instance();
    input.focus = jest.fn();
    wrapper.find('.rc-select-selection__placeholder').simulate('click');

    expect(input.focus).toBeCalled();
  });

  it('combox could comstomize input element', () => {
    const handleKeyDown = jest.fn();
    const wrapper = mount(
      <Select combobox getInputElement={() => <textarea onKeyDown={handleKeyDown} />}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    expect(wrapper.find('textarea').length).toBe(1);
    wrapper.find('.rc-select').simulate('click');
    wrapper.find('.rc-select').find('textarea').simulate('keyDown', { keyCode: KeyCode.NUM_ONE });

    wrapper.find('MenuItem').first().simulate('click');
    expect(wrapper.state().inputValue).toBe('1');
    expect(handleKeyDown).toBeCalled();
  });

  describe('propTypes', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    beforeEach(() => {
      spy.mockReset();
    });

    afterAll(() => {
      spy.mockRestore();
    });

    it('warns on invalid value when labelInValue', () => {
      mount(
        <Select labelInValue value="foo" />
      );
      expect(spy.mock.calls[0][0]).toMatch(
        'Warning: Failed prop type: Invalid prop `value` supplied to `Select`, ' +
        'when you set `labelInValue` to `true`,' +
        ' `value` should in shape of `{ key: string | number, label?: ReactNode }`'
      );
    });

    it('warns on invalid value when multiple', () => {
      mount(
        <Select multiple value="" />
      );
      expect(spy.mock.calls[0][0]).toMatch(
        'Warning: Failed prop type: Invalid prop `value` of type `string` supplied to `Select`, ' +
        'expected `array` when `multiple` or `tags` is `true`'
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
      </Select>
    );

    expect(wrapper.find('MenuItemGroup').props().title).toBe('group1');
  });

  it('filters options by inputValue', () => {
    const wrapper = mount(
      <Select open>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="11" disabled>11</Option>
      </Select>
    );

    wrapper.find('input').simulate('change', { target: { value: '1' } });
    expect(wrapper.find('li')).toHaveLength(1);
    expect(wrapper.find('li').text()).toEqual('1');
  });

  it('should include disabled item in options', () => {
    const wrapper = mount(
      <Select tags open value={['name1']}>
        <Option key="name1" disabled>name1</Option>
        <Option key="name2">name2</Option>
      </Select>
    );
    expect(wrapper.find('li.rc-select-dropdown-menu-item')).toHaveLength(2);
  });

  it('renders not found when search result is empty', () => {
    const wrapper = mount(
      <Select open>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    wrapper.find('input').simulate('change', { target: { value: '3' } });
    expect(wrapper.find('li')).toHaveLength(1);
    expect(wrapper.find('li').text()).toEqual('Not Found');
  });

  it('warns on invalid children', () => {
    const Foo = () => <div>foo</div>;
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount(
      <Select open>
        <Foo value="1" />
      </Select>
    );
    expect(spy.mock.calls.length).toBe(1);
    expect(spy.mock.calls[0][0]).toContain(
      'the children of `Select` should be `Select.Option` or `Select.OptGroup`, ' +
      `instead of \`Foo\`.`
    );
    spy.mockRestore();
  });

  it('filterOption could be true as described in default value', () => {
    const wrapper = render(
      <Select inputValue="3" filterOption open>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('does not filter when filterOption value is false', () => {
    const wrapper = render(
      <Select inputValue="1" filterOption={false} open>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('backfill', () => {
    const handleChange = jest.fn();
    const handleSelect = jest.fn();
    const wrapper = mount(
      <Select
        backfill
        open
        onChange={handleChange}
        onSelect={handleSelect}
        optionLabelProp="children"
      >
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>
    );

    const input = wrapper.find('input');

    input.simulate('keyDown', { keyCode: KeyCode.DOWN });

    expect(wrapper.state().value).toEqual(['2']);
    expect(wrapper.state().backfillValue).toEqual('2');
    expect(handleChange).not.toBeCalled();
    expect(handleSelect).not.toBeCalled();

    input.simulate('keyDown', { keyCode: KeyCode.ENTER });

    expect(wrapper.state().value).toEqual(['2']);
    expect(handleChange).toBeCalledWith('2', expect.anything());
    expect(handleSelect).toBeCalledWith('2', expect.anything());
    expect(wrapper.find('.rc-select-selection-selected-value').text()).toEqual('Two');
  });

  describe('number value', () => {
    it('support number value', () => {
      const handleChange = jest.fn();

      const wrapper = mount(
        <Select defaultValue={1} onChange={handleChange}>
          <Option value={1}>1</Option>
          <Option value={2}>2</Option>
        </Select>
      );

      expect(
        wrapper.find('.rc-select-selection-selected-value').text()
      ).toBe('1');

      wrapper.find('.rc-select').simulate('click');
      wrapper.find('MenuItem').at(1).simulate('click');
      expect(handleChange).toBeCalledWith(2, expect.anything());
      expect(
        wrapper.find('.rc-select-selection-selected-value').text()
      ).toBe('2');
    });

    it('search number value', () => {
      const wrapper = mount(
        <Select showSearch>
          <Option value={1}>1</Option>
          <Option value={2}>2</Option>
        </Select>
      );

      wrapper.find('input').simulate('change', { target: { value: '1' } });
      expect(wrapper.find('MenuItem').props().value).toBe(1);
    });
  });

  it('should render custom dropdown correctly', () => {
    const wrapper = render(
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
      </Select>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger click event in custom node', () => {
    const handleClick = jest.fn();
    const wrapper = mount(
      <Select
        dropdownRender={(menu) => (
          <div>
            <div id="dropdown-custom-node" onClick={handleClick}>
              CUSTOM NODE
            </div>
            {menu}
          </div>
        )}
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    wrapper.find('.rc-select').simulate('click');
    wrapper.find('div#dropdown-custom-node').simulate('click');
    expect(handleClick).toBeCalled();
  });

  it('set showAction', () => {
    const wrapper = mount(
      <Select showAction={['mouseEnter']}>
        <Option value="1">1</Option>
      </Select>
    );

    wrapper.find('.rc-select').simulate('click');
    expect(wrapper.hasClass('rc-select-open')).toBe(false);

    wrapper.find('.rc-select').simulate('mouseEnter');

    expect(wrapper.find('.rc-select').hasClass('rc-select-open')).toBe(true);
  });

  it('default filterOption is case insensitive', () => {
    const wrapper = mount(
      <Select>
        <Option value="ABC">ABC</Option>
        <Option value="DEF">DEF</Option>
      </Select>
    );

    wrapper.find('input').simulate('change', { target: { value: 'B' } });
    expect(wrapper.find('MenuItem').length).toBe(1);
    expect(wrapper.find('MenuItem').props().value).toBe('ABC');
  });

  it('check title when label is a object', () => {
    const wrapper = render(
      <Select defaultValue="0">
        <Option value="0">
          <span>Not Show Title</span>
        </Option>
      </Select>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('accepts prop id', () => {
    const wrapper = render(
      <Select id="my-select">
        <Option value="1">One</Option>
      </Select>
    );

    expect(wrapper.find('#my-select').length).toBe(1);
  });

  it('not select first option when no result', () => {
    const handleSelect = jest.fn();
    const wrapper = mount(
      <Select
        defaultActiveFirstOption
        filterOption={(inputValue, option) => {
          return option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
        }}
        onSelect={handleSelect}
      >
        <Option value="Burns Bay Road">Burns Bay Road</Option>
        <Option value="Downing Street">Downing Street</Option>
        <Option value="Wall Street">Wall Street</Option>
      </Select>
    );

    wrapper.find('input').simulate('change', { target: { value: 'b' } });
    expect(wrapper.state().inputValue).toBe('b');
    expect(wrapper.find('MenuItem').length).toBe(1);
    expect(wrapper.find('MenuItem').props().value).toBe('Burns Bay Road');
    expect(wrapper.find('MenuItem').props().disabled).toBeFalsy();

    wrapper.find('input').simulate('change', { target: { value: 'c' } });
    expect(wrapper.state().inputValue).toBe('c');
    expect(wrapper.find('MenuItem').length).toBe(1);
    expect(wrapper.find('MenuItem').props().value).toBe('NOT_FOUND');
    expect(wrapper.find('MenuItem').props().disabled).toBeTruthy();

    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.ENTER });
    expect(wrapper.state().inputValue).toBe('c');
    expect(handleSelect).not.toBeCalled();
  });

  // https://github.com/ant-design/ant-design/issues/12172
  it('onChange trigger only once when value is 0', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Select onChange={onChange}>
        <Option value={0}>0</Option>
      </Select>
    );

    wrapper.find('.rc-select').simulate('click');
    wrapper.find('li[role="option"]').at(0).simulate('click');

    expect(onChange).toBeCalled();
    onChange.mockReset();

    wrapper.find('.rc-select').simulate('click');
    wrapper.find('li[role="option"]').at(0).simulate('click');

    expect(onChange).not.toBeCalled();
  });

  // https://github.com/ant-design/ant-design/issues/12260
  it('dropdown menu width should not be smaller than trigger even dropdownMatchSelectWidth is false', () => {
    const wrapper = mount(
      <Select style={{ width: 1000 }} dropdownMatchSelectWidth={false}>
        <Option value={0}>0</Option>
        <Option value={1}>1</Option>
      </Select>
    );
    wrapper.find('.rc-select').simulate('click');
    expect(typeof wrapper.find('SelectTrigger').state().dropdownWidth).toBe('number');
  });
});
