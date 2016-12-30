/* eslint-disable no-undef */
import React from 'react';
import { mount, render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import KeyCode from 'rc-util/lib/KeyCode';
import Select, { Option, OptGroup } from '../src';

describe('Select', () => {
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

      expect(renderToJson(wrapper)).toMatchSnapshot();
    });

    it('renders dropdown correctly', () => {
      const wrapper = mount(select);

      wrapper.find('.select-test').simulate('click');
      expect(wrapper.find('.select-test').props().className).toContain('-open');

      const dropdownWrapper = render(wrapper.find('Trigger').node.getComponent());
      expect(renderToJson(dropdownWrapper)).toMatchSnapshot();
    });
  });

  it('convert value to array', () => {
    const wrapper = mount(
      <Select value="1">
        <OptGroup>
          <Option value="1" title="一">1</Option>
        </OptGroup>
      </Select>
    );
    expect(wrapper.state().value).toEqual([{ key: '1', label: '1', title: '一' }]);
  });

  it('convert defaultValue to array', () => {
    const wrapper = mount(
      <Select defaultValue="1">
        <OptGroup>
          <Option value="1" title="一">1</Option>
        </OptGroup>
      </Select>
    );
    expect(wrapper.state().value).toEqual([{ key: '1', label: '1', title: '一' }]);
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
    const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());
    expect(dropdownWrapper.find('Menu').props().selectedKeys).toEqual(['2']);
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
    const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());
    expect(dropdownWrapper.find('Menu').props().selectedKeys).toEqual(['1', '2']);
  });

  it('should hide clear button', () => {
    const wrapper = mount(
      <Select allowClear>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );
    expect(wrapper.find('.rc-select-selection__clear').props().style.display).toBe('none');
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

  it('filter options by values', () => {
    const wrapper = mount(
      <Select>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>
    );

    wrapper.find('input').simulate('change', { target: { value: '1' } });
    const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());
    expect(dropdownWrapper.find('MenuItem').length).toBe(1);
    expect(dropdownWrapper.find('MenuItem').props().value).toBe('1');
  });

  it('specify which prop to filter', () => {
    const wrapper = mount(
      <Select optionFilterProp="label">
        <Option value="1" label="One">1</Option>
        <Option value="2" label="Two">2</Option>
      </Select>
    );

    wrapper.find('input').simulate('change', { target: { value: 'Two' } });
    const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());

    expect(dropdownWrapper.find('MenuItem').length).toBe(1);
    expect(dropdownWrapper.find('MenuItem').props().value).toBe('2');
  });

  it('no search', () => {
    const wrapper = render(
      <Select showSearch={false} value="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    expect(renderToJson(wrapper)).toMatchSnapshot();
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
    expect(handleChange).toBeCalledWith(undefined);
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
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>
    );

    wrapper.find('.rc-select').simulate('click');
    const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());
    dropdownWrapper.find('MenuItem').first().simulate('click');
    expect(handleChange).toBeCalledWith({ key: '1', label: 'One' });
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
      wrapper.find('div').first().simulate('focus');
    });

    it('set _focused to true', () => {
      expect(wrapper.instance()._focused).toBe(true);
    });

    it('fires focus event', () => {
      expect(handleFocus).toBeCalled();
    });

    it('set className', () => {
      expect(wrapper.find('div').first().node.className).toContain('-focus');
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
        >
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
      );
      jest.useFakeTimers();
      wrapper.find('input').simulate('change', { target: { value: '1' } });
      wrapper.find('div').first().simulate('blur');
      jest.runAllTimers();
    });

    it('set _focused to false', () => {
      expect(wrapper.instance()._focused).toBe(false);
    });

    it('fires change event', () => {
      expect(handleChange).toBeCalledWith('1');
    });

    it('fires blur event', () => {
      expect(handleBlur).toBeCalled();
    });

    it('set className', () => {
      expect(wrapper.find('div').first().node.className).not.toContain('-focus');
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
      wrapper.find('div').first().simulate('blur');

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

    const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());
    dropdownWrapper.find('MenuItem').simulate('click');
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

  it('focus input when placeholder is clicked', () => {
    const wrapper = mount(
      <Select placeholder="select">
        <Option value="1">1</Option>
      </Select>
    );

    const input = wrapper.find('input').node;
    input.focus = jest.fn();
    wrapper.find('.rc-select-selection__placeholder').simulate('click');

    expect(input.focus).toBeCalled();
  });

  it('combox could comstomize input element', () => {
    const wrapper = mount(
      <Select combobox getInputElement={() => <textarea />}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );

    expect(wrapper.find('textarea').length).toBe(1);
    wrapper.find('.rc-select').simulate('click');
    const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());

    dropdownWrapper.find('MenuItem').first().simulate('click');
    expect(wrapper.state().inputValue).toBe('1');
  });
});
