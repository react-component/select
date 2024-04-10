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
  keyDown,
} from './utils/common';
import allowClearTest from './shared/allowClearTest';
import { fireEvent, render } from '@testing-library/react';

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
    const { container } = render(
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

    fireEvent.change(container.querySelector('input'), {
      target: {
        value: 'One',
      },
    });
    expect(handleChange).not.toHaveBeenCalled();

    handleChange.mockReset();
    fireEvent.change(container.querySelector('input'), {
      target: {
        value: 'One,Two,Three',
      },
    });
    expect(handleChange).toHaveBeenCalledWith(['1', '2'], expect.anything());

    expect(container.querySelector('input').value).toBe('');
    expectOpen(container, false);
  });

  it('tokenize input when mode=tags and open=false', () => {
    const handleChange = jest.fn();
    const handleSelect = jest.fn();
    const { container } = render(
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

    fireEvent.change(container.querySelector('input'), {
      target: {
        value: 'One',
      },
    });
    expect(handleChange).not.toHaveBeenCalled();

    handleChange.mockReset();
    fireEvent.change(container.querySelector('input'), {
      target: {
        value: 'One,Two,Three,',
      },
    });
    expect(handleChange).toHaveBeenCalledWith(['One', 'Two', 'Three'], expect.anything());

    expect(container.querySelector('input').value).toBe('');
  });

  it("shouldn't separate words when compositing", () => {
    const handleChange = jest.fn();
    const handleSelect = jest.fn();
    const { container } = render(
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

    fireEvent.change(container.querySelector('input'), {
      target: {
        value: 'One',
      },
    });
    expect(handleChange).not.toHaveBeenCalled();

    handleChange.mockReset();
    fireEvent.compositionStart(container.querySelector('input'));
    fireEvent.change(container.querySelector('input'), {
      target: {
        value: 'One,Two,Three',
      },
    });
    expect(handleChange).not.toHaveBeenCalled();

    handleChange.mockReset();
    fireEvent.compositionEnd(container.querySelector('input'));
    fireEvent.change(container.querySelector('input'), {
      target: {
        value: 'One,Two,Three',
      },
    });
    expect(handleChange).toHaveBeenCalledWith(['1', '2'], expect.anything());

    expect(container.querySelector('input').value).toBe('');
    expectOpen(container, false);
  });

  it('should separate words when optionLabelProp is not children', () => {
    const handleChange = jest.fn();
    const { container } = render(
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
    fireEvent.change(container.querySelector('input'), {
      target: {
        value: 'One,Two',
      },
    });
    expect(handleChange).toHaveBeenCalledWith(['1', '2'], expect.anything());
  });

  it('should separate words when optionFilterProp is not children', () => {
    const handleChange = jest.fn();
    const { container } = render(
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
    fireEvent.change(container.querySelector('input'), {
      target: {
        value: 'One,Two',
      },
    });
    expect(handleChange).toHaveBeenCalledWith(['1', '2'], expect.anything());
  });

  it('focus', () => {
    jest.useFakeTimers();
    const handleFocus = jest.fn();
    const { container } = render(
      <Select mode="multiple" onFocus={handleFocus}>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>,
    );
    fireEvent.focus(container.querySelector('input'));
    jest.runAllTimers();
    expect(handleFocus).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('OptGroup without key', () => {
    expect(() => {
      render(
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

    const { container } = render(
      <Select mode="multiple" defaultValue={[1]} onChange={handleChange}>
        <Option value={1}>1</Option>
        <Option value={2} testprop={2}>
          2
        </Option>
      </Select>,
    );

    expect(findSelection(container).textContent).toEqual('1');

    toggleOpen(container);
    selectItem(container, 1);

    expect(handleChange).toHaveBeenCalledWith(
      [1, 2],
      [expect.objectContaining({ value: 1 }), expect.objectContaining({ value: 2, testprop: 2 })],
    );
  });

  it('do not open when close button click', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Select mode="multiple" onChange={onChange}>
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );

    toggleOpen(container);
    selectItem(container, 0);
    selectItem(container, 1);

    toggleOpen(container);
    expectOpen(container, false);
    removeSelection(container);
    expectOpen(container, false);
    expect(onChange).toHaveBeenCalledWith([2], expect.anything());
  });

  it('select when item enter', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Select mode="multiple" onChange={onChange}>
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );

    toggleOpen(container);
    fireEvent.mouseMove(container.querySelectorAll('.rc-select-item-option')[1]);

    keyDown(container.querySelector('input'), KeyCode.ENTER);
    expectOpen(container);
    expect(onChange).toHaveBeenCalledWith([2], expect.anything());
  });

  it('enter twice to cancel the selection', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Select mode="multiple" onChange={onChange}>
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );

    toggleOpen(container);
    fireEvent.mouseMove(container.querySelectorAll('.rc-select-item-option')[0]);
    keyDown(container.querySelector('input'), KeyCode.ENTER);

    fireEvent.mouseMove(container.querySelectorAll('.rc-select-item-option')[0]);
    keyDown(container.querySelector('input'), KeyCode.ENTER);

    expect(onChange).toHaveBeenCalledWith([], expect.anything());
  });

  return;

  it('do not crash when children has empty', () => {
    const { container } = render(
      <Select mode="multiple">
        {null}
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );

    toggleOpen(container);
    selectItem(container);

    // Do not crash
  });

  it('do not crash when value has empty string', () => {
    const { container } = render(
      <Select mode="multiple" value={['']}>
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );

    expect(findSelection(container).textContent).toEqual('');
  });

  it('show arrow on multiple mode when explicitly set', () => {
    const { container } = render(
      <Select mode="multiple" value={['']}>
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );

    expect(wrapper.find('.rc-select-arrow').length).toBeFalsy();

    wrapper.setProps({
      suffixIcon: <div>arrow</div>,
    });
    expect(wrapper.find('.rc-select-arrow').length).toBeTruthy();
  });

  it('block input when fast backspace', () => {
    jest.useFakeTimers();
    const onChange = jest.fn();

    const { container } = render(
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
    const { container } = render(
      <Select mode="multiple" searchValue="light" placeholder="bamboo" />,
    );
    expect(wrapper.find('.rc-select-selection-placeholder').length).toBeTruthy();
    toggleOpen(container);
    expect(wrapper.find('.rc-select-selection-placeholder').length).toBeFalsy();
  });

  it('clear input when popup closed', () => {
    const { container } = render(
      <Select mode="multiple" options={[{ value: 'light' }]} showSearch />,
    );
    toggleOpen(container);
    wrapper.find('input').simulate('change', { target: { value: 'bamboo' } });
    expect(wrapper.find('input').props().value).toEqual('bamboo');

    // Close and open again
    toggleOpen(container);
    toggleOpen(container);
    expect(wrapper.find('input').props().value).toEqual('');
  });

  it('ajax update should keep options', () => {
    const onChange = jest.fn();

    const { container } = render(
      <Select
        labelInValue
        mode="multiple"
        options={[{ value: 'light', label: 'Light', option: 2333 }]}
        onChange={onChange}
        showSearch
      />,
    );

    // First select
    toggleOpen(container);
    selectItem(container, 0);
    expect(onChange).toHaveBeenCalledWith(
      [{ label: 'Light', value: 'light', key: 'light' }],
      [{ label: 'Light', value: 'light', option: 2333 }],
    );
    onChange.mockReset();

    // Next select
    wrapper.setProps({ options: [{ value: 'bamboo', label: 'Bamboo', option: 444 }] });
    toggleOpen(container);
    selectItem(container, 0);
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
    const { container } = render(
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
    const { container } = render(
      <Select mode="multiple" options={[{ value: 'bamboo' }, { value: 'light' }]} tabIndex={0} />,
    );
    expect(wrapper.find('.rc-select').getDOMNode().getAttribute('tabindex')).toBeNull();

    expect(
      wrapper.find('input.rc-select-selection-search-input').getDOMNode().getAttribute('tabindex'),
    ).toBe('0');
  });

  it('should render title defaultly', () => {
    const { container } = render(
      <Select mode="multiple" options={[{ value: 'title' }]} value={['title']} />,
    );
    expect(wrapper.find('.rc-select-selection-item').first().prop('title')).toBe('title');
  });

  it('should not render title defaultly when label is ReactNode', () => {
    const { container } = render(
      <Select mode="multiple" options={[{ value: '1', label: <div>label</div> }]} value={['1']} />,
    );
    expect(wrapper.find('.rc-select-selection-item').first().prop('title')).toBe(undefined);
  });

  it('disabled should not show remove icon', () => {
    const { container } = render(
      <Select mode="multiple" value={[1]}>
        <Option value={1} disabled>
          1
        </Option>
      </Select>,
    );

    expect(wrapper.exists('.rc-select-selection-item-remove')).toBeFalsy();
  });

  it('do not crash if value not in options when removing option', () => {
    const { container } = render(
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
    expect(findSelection(wrapper, 0).textContent).toEqual('value not in options');
    removeSelection(container, 0);
    expect(wrapper.find('Selector').props().values.length).toEqual(0);
  });

  it('display correctly when value is undefined or null', () => {
    const wrapper1 = render(
      <Select mode="multiple" value={undefined}>
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );
    const wrapper2 = render(
      <Select mode="multiple" value={null}>
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );

    expect(wrapper1.find('.rc-select-selection-item').length).toBe(0);
    expect(wrapper2.find('.rc-select-selection-item').length).toBe(0);
  });

  describe('optionLabelProp', () => {
    it('basic', () => {
      const { container } = render(
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

      expect(findSelection(wrapper, 0).textContent).toBe('BAMBOO');
      expect(findSelection(wrapper, 1).textContent).toBe('LITTLE');
      expect(wrapper.find('div.rc-select-item-option-content').at(0).textContent).toBe('Bamboo');
      expect(wrapper.find('div.rc-select-item-option-content').at(1).textContent).toBe('Little');
    });

    it('select no warning', () => {
      const { container } = render(
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

      toggleOpen(container);
      selectItem(container);

      expect(errSpy).not.toHaveBeenCalled();
      errSpy.mockRestore();
    });

    it('selected icon should show when value is empty', () => {
      const { container } = render(
        <Select
          mode="multiple"
          open
          options={[
            {
              label: 'Bamboo',
              value: '',
            },
          ]}
        />,
      );
      toggleOpen(container);
      selectItem(container, 0);
      expect(wrapper.find('.rc-select-item-option-state-icon').at(0).textContent).toBe('✓');
      selectItem(container, 0);
      expect(wrapper.find('.rc-select-item-option-state-icon').at(0).textContent).toBe('');
    });
  });

  describe('autoClearSearchValue', () => {
    it('search value should not show when autoClearSearchValue is undefined', () => {
      const { container } = render(
        <Select mode="multiple" open={false} showSearch={true} searchValue="test" />,
      );
      expect(wrapper.find('input').props().value).toBe('');
    });
    it('search value should show when autoClearSearchValue is false', () => {
      const { container } = render(
        <Select
          mode="multiple"
          open={false}
          autoClearSearchValue={false}
          showSearch={true}
          searchValue="test"
        />,
      );
      expect(wrapper.find('input').props().value).toBe('test');
    });
    it('search value should no clear when autoClearSearchValue is false', () => {
      const { container } = render(
        <Select
          mode="multiple"
          autoClearSearchValue={false}
          showSearch={true}
          searchValue="test"
        />,
      );

      toggleOpen(container);
      toggleOpen(container);
      expect(wrapper.find('input').props().value).toBe('test');
    });
    it('search value should clear when autoClearSearchValue is true', () => {
      const { container } = render(
        <Select mode="multiple" autoClearSearchValue={true} showSearch={true} searchValue="test" />,
      );
      toggleOpen(container);
      toggleOpen(container);
      expect(wrapper.find('input').props().value).toBe('');
    });
  });
});
