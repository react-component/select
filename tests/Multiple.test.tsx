import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import React from 'react';
import Select, { Option, OptGroup } from '../src';
import focusTest from './shared/focusTest';
import blurTest from './shared/blurTest';
import hoverTest from './shared/hoverTest';
import renderTest from './shared/renderTest';
import removeSelectedTest from './shared/removeSelectedTest';
import dynamicChildrenTest from './shared/dynamicChildrenTest';
import inputFilterTest from './shared/inputFilterTest';
import {
  expectOpen,
  toggleOpen,
  selectItem,
  injectRunAllTimers,
  findSelection,
  removeSelection,
} from './utils/common';
import allowClearTest from './shared/allowClearTest';

describe('Select.Multiple', () => {
  injectRunAllTimers(jest);

  allowClearTest('multiple', ['903']);
  focusTest('multiple');
  blurTest('multiple');
  hoverTest('multiple');
  renderTest('multiple');
  removeSelectedTest('multiple');
  dynamicChildrenTest('multiple');
  inputFilterTest('multiple');

  it('tokenize input', () => {
    const handleChange = jest.fn();
    const handleSelect = jest.fn();
    const wrapper = mount(
      <Select
        mode="multiple"
        optionLabelProp="children"
        tokenSeparators={[',']}
        onChange={handleChange}
        onSelect={handleSelect}
      >
        <OptGroup key="group1">
          <Option value="1">One</Option>
        </OptGroup>
        <OptGroup key="group2">
          <Option value="2">Two</Option>
        </OptGroup>
      </Select>,
    );

    wrapper.find('input').simulate('change', {
      target: {
        value: 'One',
      },
    });
    expect(handleChange).not.toHaveBeenCalled();

    handleChange.mockReset();
    wrapper.find('input').simulate('change', {
      target: {
        value: 'One,Two,Three',
      },
    });
    expect(handleChange).toHaveBeenCalledWith(['1', '2'], expect.anything());

    // Seems this is should not fire event? Commented for now.
    // handleChange.mockReset();
    // wrapper.find('input').simulate('change', {
    //   target: {
    //     value: 'One,Two',
    //   },
    // });
    // expect(handleChange).toHaveBeenCalledWith(['1', '2'], expect.anything());

    expect(wrapper.find('input').props().value).toBe('');
    wrapper.update();
    expectOpen(wrapper, false);
  });

  it('tokenize input when mode=tags and open=false', () => {
    const handleChange = jest.fn();
    const handleSelect = jest.fn();
    const wrapper = mount(
      <Select
        mode="tags"
        optionLabelProp="children"
        tokenSeparators={[',']}
        onChange={handleChange}
        onSelect={handleSelect}
        open={false}
      >
        <Option value="0">Zero</Option>
      </Select>,
    );

    wrapper.find('input').simulate('change', {
      target: {
        value: 'One',
      },
    });
    expect(handleChange).not.toHaveBeenCalled();

    handleChange.mockReset();
    wrapper.find('input').simulate('change', {
      target: {
        value: 'One,Two,Three,',
      },
    });
    expect(handleChange).toHaveBeenCalledWith(['One', 'Two', 'Three'], expect.anything());

    // Seems this is should not fire event? Commented for now.
    // handleChange.mockReset();
    // wrapper.find('input').simulate('change', {
    //   target: {
    //     value: 'One,Two,',
    //   },
    // });
    // expect(handleChange).toHaveBeenCalledWith(['One', 'Two', 'Three'], expect.anything());

    expect(wrapper.find('input').props().value).toBe('');
  });

  it("shouldn't separate words when compositing", () => {
    const handleChange = jest.fn();
    const handleSelect = jest.fn();
    const wrapper = mount(
      <Select
        mode="multiple"
        optionLabelProp="children"
        tokenSeparators={[',']}
        onChange={handleChange}
        onSelect={handleSelect}
      >
        <OptGroup key="group1">
          <Option value="1">One</Option>
        </OptGroup>
        <OptGroup key="group2">
          <Option value="2">Two</Option>
        </OptGroup>
      </Select>,
    );

    wrapper.find('input').simulate('change', {
      target: {
        value: 'One',
      },
    });
    expect(handleChange).not.toHaveBeenCalled();

    handleChange.mockReset();
    wrapper.find('input').simulate('compositionstart');
    wrapper.find('input').simulate('change', {
      target: {
        value: 'One,Two,Three',
      },
    });
    expect(handleChange).not.toHaveBeenCalled();

    handleChange.mockReset();
    wrapper.find('input').simulate('compositionend');
    wrapper.find('input').simulate('change', {
      target: {
        value: 'One,Two,Three',
      },
    });
    expect(handleChange).toHaveBeenCalledWith(['1', '2'], expect.anything());

    // Seems this is should not fire event? Commented for now.
    // handleChange.mockReset();
    // wrapper.find('input').simulate('change', {
    //   target: {
    //     value: 'One,Two',
    //   },
    // });
    // expect(handleChange).toHaveBeenCalledWith(['1', '2'], expect.anything());

    expect(wrapper.find('input').props().value).toBe('');
    wrapper.update();
    expectOpen(wrapper, false);
  });

  it('should separate words when optionLabelProp is not children', () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      <Select
        mode="multiple"
        optionLabelProp="label"
        tokenSeparators={[',']}
        onChange={handleChange}
      >
        <Option value="1" label="One">
          <div>One</div>
        </Option>
        <Option value="2" label="Two">
          <div>Two</div>
        </Option>
      </Select>,
    );
    wrapper.find('input').simulate('change', {
      target: {
        value: 'One,Two',
      },
    });
    expect(handleChange).toHaveBeenCalledWith(['1', '2'], expect.anything());
  });

  it('should separate words when optionFilterProp is not children', () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      <Select
        mode="multiple"
        optionFilterProp="label"
        tokenSeparators={[',']}
        onChange={handleChange}
      >
        <Option value="1" label="One">
          <div>One</div>
        </Option>
        <Option value="2" label="Two">
          <div>Two</div>
        </Option>
      </Select>,
    );
    wrapper.find('input').simulate('change', {
      target: {
        value: 'One,Two',
      },
    });
    expect(handleChange).toHaveBeenCalledWith(['1', '2'], expect.anything());
  });

  it('focus', () => {
    jest.useFakeTimers();
    const handleFocus = jest.fn();
    const wrapper = mount(
      <Select mode="multiple" onFocus={handleFocus}>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>,
    );
    wrapper.find('input').simulate('focus');
    jest.runAllTimers();
    expect(handleFocus).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('OptGroup without key', () => {
    expect(() => {
      mount(
        <Select mode="multiple" defaultValue={['1']}>
          <OptGroup label="group1">
            <Option value="1">One</Option>
          </OptGroup>
          <OptGroup label="group2">
            <Option value="2">Two</Option>
          </OptGroup>
        </Select>,
      );
    }).not.toThrow();
  });

  it('allow number value', () => {
    const handleChange = jest.fn();

    const wrapper = mount(
      <Select mode="multiple" defaultValue={[1]} onChange={handleChange}>
        <Option value={1}>1</Option>
        <Option value={2} testprop={2}>
          2
        </Option>
      </Select>,
    );

    expect(findSelection(wrapper).text()).toEqual('1');

    toggleOpen(wrapper);
    selectItem(wrapper, 1);

    expect(handleChange).toHaveBeenCalledWith(
      [1, 2],
      [expect.objectContaining({ value: 1 }), expect.objectContaining({ value: 2, testprop: 2 })],
    );
  });

  it('do not open when close button click', () => {
    const wrapper = mount(
      <Select mode="multiple">
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );

    toggleOpen(wrapper);
    selectItem(wrapper, 0);
    selectItem(wrapper, 1);

    toggleOpen(wrapper);
    expectOpen(wrapper, false);
    removeSelection(wrapper);
    expectOpen(wrapper, false);
    expect(wrapper.find('Selector').props().values).toEqual([
      expect.objectContaining({ value: 2 }),
    ]);
  });

  it('select when item enter', () => {
    const wrapper = mount(
      <Select mode="multiple">
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );

    toggleOpen(wrapper);
    wrapper.find('div.rc-select-item-option').at(1).simulate('mouseMove');

    wrapper.find('input').simulate('keyDown', { which: KeyCode.ENTER });
    expectOpen(wrapper);
    expect(wrapper.find('Selector').props().values).toEqual([
      expect.objectContaining({ value: 2 }),
    ]);
  });

  it('enter twice to cancel the selection', () => {
    const wrapper = mount(
      <Select mode="multiple">
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );

    toggleOpen(wrapper);
    wrapper.find('div.rc-select-item-option').first().simulate('mousemove');
    wrapper.find('input').simulate('keyDown', { which: KeyCode.ENTER });

    wrapper.find('div.rc-select-item-option').first().simulate('mousemove');
    wrapper.find('input').simulate('keyDown', { which: KeyCode.ENTER });

    expect(wrapper.find('Selector').props().values).toEqual([]);
  });

  it('do not crash when children has empty', () => {
    const wrapper = mount(
      <Select mode="multiple">
        {null}
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );

    toggleOpen(wrapper);
    selectItem(wrapper);

    // Do not crash
  });

  it('do not crash when value has empty string', () => {
    const wrapper = mount(
      <Select mode="multiple" value={['']}>
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );

    expect(findSelection(wrapper).text()).toEqual('');
  });

  it('show arrow on multiple mode when explicitly set', () => {
    const wrapper = mount(
      <Select mode="multiple" value={['']}>
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );

    expect(wrapper.find('.rc-select-arrow-icon').length).toBeFalsy();

    wrapper.setProps({
      showArrow: true,
    });
    expect(wrapper.find('.rc-select-arrow-icon').length).toBeTruthy();
  });

  it('block input when fast backspace', () => {
    jest.useFakeTimers();
    const onChange = jest.fn();

    const wrapper = mount(
      <Select
        mode="multiple"
        value={['bamboo']}
        options={[{ value: 'bamboo' }, { value: 'light' }]}
        onChange={onChange}
      />,
    );

    // First type
    wrapper.find('input').simulate('keydown', { which: KeyCode.L });
    wrapper.find('input').simulate('change', { target: { value: 'l' } });

    // Backspace
    wrapper.find('input').simulate('keydown', { which: KeyCode.BACKSPACE });
    wrapper.find('input').simulate('change', { target: { value: '' } });

    onChange.mockReset();

    wrapper.find('input').simulate('keydown', { which: KeyCode.BACKSPACE });
    expect(onChange).not.toHaveBeenCalled();

    jest.runAllTimers();
    wrapper.find('input').simulate('keydown', { which: KeyCode.BACKSPACE });
    expect(onChange).toHaveBeenCalledWith([], expect.anything());

    jest.useRealTimers();
  });

  it('show placeholder when searchValue is controlled', () => {
    const wrapper = mount(<Select mode="multiple" searchValue="light" placeholder="bamboo" />);
    expect(wrapper.find('.rc-select-selection-placeholder').length).toBeTruthy();
    toggleOpen(wrapper);
    expect(wrapper.find('.rc-select-selection-placeholder').length).toBeFalsy();
  });

  it('clear input when popup closed', () => {
    const wrapper = mount(<Select mode="multiple" options={[{ value: 'light' }]} showSearch />);
    toggleOpen(wrapper);
    wrapper.find('input').simulate('change', { target: { value: 'bamboo' } });
    expect(wrapper.find('input').props().value).toEqual('bamboo');

    // Close and open again
    toggleOpen(wrapper);
    toggleOpen(wrapper);
    expect(wrapper.find('input').props().value).toEqual('');
  });

  it('ajax update should keep options', () => {
    const onChange = jest.fn();

    const wrapper = mount(
      <Select
        labelInValue
        mode="multiple"
        options={[{ value: 'light', label: 'Light', option: 2333 }]}
        onChange={onChange}
        showSearch
      />,
    );

    // First select
    toggleOpen(wrapper);
    selectItem(wrapper, 0);
    expect(onChange).toHaveBeenCalledWith(
      [{ label: 'Light', value: 'light', key: 'light' }],
      [{ label: 'Light', value: 'light', option: 2333 }],
    );
    onChange.mockReset();

    // Next select
    wrapper.setProps({ options: [{ value: 'bamboo', label: 'Bamboo', option: 444 }] });
    toggleOpen(wrapper);
    selectItem(wrapper, 0);
    expect(onChange).toHaveBeenCalledWith(
      [
        { label: 'Light', value: 'light', key: 'light' },
        { label: 'Bamboo', value: 'bamboo', key: 'bamboo' },
      ],
      [
        { label: 'Light', value: 'light', option: 2333 },
        { value: 'bamboo', label: 'Bamboo', option: 444 },
      ],
    );
  });

  it('focus should enable showSearch input', () => {
    const wrapper = mount(
      <Select
        mode="multiple"
        options={[{ value: 'light', label: 'Light', option: 2333 }]}
        showSearch
      />,
    );

    wrapper.find('input').simulate('focus');

    expect(wrapper.find('Input').prop('editable')).toBeTruthy();
  });

  it('correctly handles the `tabIndex` prop', () => {
    const wrapper = mount(
      <Select mode="multiple" options={[{ value: 'bamboo' }, { value: 'light' }]} tabIndex={0} />,
    );
    expect(wrapper.find('.rc-select').getDOMNode().getAttribute('tabindex')).toBeNull();

    expect(
      wrapper.find('input.rc-select-selection-search-input').getDOMNode().getAttribute('tabindex'),
    ).toBe('0');
  });

  it('should render title defaultly', () => {
    const wrapper = mount(
      <Select mode="multiple" options={[{ value: 'title' }]} value={['title']} />,
    );
    expect(wrapper.find('.rc-select-selection-item').first().prop('title')).toBe('title');
  });

  it('should not render title defaultly when label is ReactNode', () => {
    const wrapper = mount(
      <Select mode="multiple" options={[{ value: '1', label: <div>label</div> }]} value={['1']} />,
    );
    expect(wrapper.find('.rc-select-selection-item').first().prop('title')).toBe(undefined);
  });

  it('disabled should not show remove icon', () => {
    const wrapper = mount(
      <Select mode="multiple" value={[1]}>
        <Option value={1} disabled>
          1
        </Option>
      </Select>,
    );

    expect(wrapper.exists('.rc-select-selection-item-remove')).toBeFalsy();
  });

  it('do not crash if value not in options when removing option', () => {
    const wrapper = mount(
      <Select
        defaultValue={[
          {
            label: 'value not in options',
            value: 'value-not-in-options',
          },
        ]}
        mode="multiple"
        labelInValue
      >
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );
    expect(findSelection(wrapper, 0).text()).toEqual('value not in options');
    removeSelection(wrapper, 0);
    expect(wrapper.find('Selector').props().values.length).toEqual(0);
  });

  describe('optionLabelProp', () => {
    it('basic', () => {
      const wrapper = mount(
        <Select
          mode="multiple"
          value={['bamboo', 'little']}
          open
          optionLabelProp="selector"
          options={[
            {
              label: 'Bamboo',
              value: 'bamboo',
              selector: 'BAMBOO',
            },
            {
              label: 'Little',
              value: 'little',
              selector: 'LITTLE',
            },
          ]}
        />,
      );

      expect(findSelection(wrapper, 0).text()).toBe('BAMBOO');
      expect(findSelection(wrapper, 1).text()).toBe('LITTLE');
      expect(wrapper.find('div.rc-select-item-option-content').at(0).text()).toBe('Bamboo');
      expect(wrapper.find('div.rc-select-item-option-content').at(1).text()).toBe('Little');
    });

    it('select no warning', () => {
      const wrapper = mount(
        <Select
          mode="multiple"
          open
          optionLabelProp="selector"
          options={[
            {
              label: 'Bamboo',
              value: 'bamboo',
              selector: 'BAMBOO',
            },
          ]}
        />,
      );

      // Select one
      const errSpy = jest.spyOn(console, 'error');

      toggleOpen(wrapper);
      selectItem(wrapper);

      expect(errSpy).not.toHaveBeenCalled();
      errSpy.mockRestore();
    });
  });
});
