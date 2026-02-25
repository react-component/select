import KeyCode from '@rc-component/util/lib/KeyCode';
import React from 'react';
import Select, { Option, OptGroup } from '../src';
import focusTest from './shared/focusTest';
import blurTest from './shared/blurTest';
import hoverTest from './shared/hoverTest';
import maxTagRenderTest from './shared/maxTagRenderTest';
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
  keyUp,
} from './utils/common';
import allowClearTest from './shared/allowClearTest';
import { act, fireEvent, render, screen } from '@testing-library/react';

describe('Select.Multiple', () => {
  injectRunAllTimers(jest);

  allowClearTest('multiple', ['903']);
  focusTest('multiple');
  blurTest('multiple');
  hoverTest('multiple');
  maxTagRenderTest('multiple');
  removeSelectedTest('multiple');
  dynamicChildrenTest('multiple');
  inputFilterTest('multiple');

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

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

  it('should prevent long press of enter', () => {
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
    keyDown(container.querySelector('input'), KeyCode.ENTER);
    keyUp(container.querySelector('input'), KeyCode.ENTER);
    expectOpen(container);
    expect(onChange).toHaveBeenCalledTimes(1);
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
    keyUp(container.querySelector('input'), KeyCode.ENTER);
    fireEvent.mouseMove(container.querySelectorAll('.rc-select-item-option')[0]);
    keyDown(container.querySelector('input'), KeyCode.ENTER);

    expect(onChange).toHaveBeenCalledWith([], expect.anything());
  });

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
    const renderDemo = (suffix?: React.ReactNode) => (
      <Select mode="multiple" value={['']} suffix={suffix}>
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>
    );
    const { container, rerender } = render(renderDemo());

    expect(container.querySelector('.rc-select-suffix')).toBeFalsy();

    rerender(renderDemo(<div>arrow</div>));
    expect(container.querySelector('.rc-select-suffix')).toBeTruthy();
  });

  it('show static prefix', () => {
    render(
      <Select mode="multiple" value={['']} prefix="Foobar">
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );

    expect(screen.findByText('Foobar')).toBeTruthy();
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
    keyDown(container.querySelector('input'), KeyCode.L);
    fireEvent.change(container.querySelector('input'), { target: { value: 'l' } });

    console.log('clear');
    // Backspace
    keyDown(container.querySelector('input'), KeyCode.BACKSPACE);
    fireEvent.change(container.querySelector('input'), { target: { value: '' } });

    onChange.mockReset();

    keyDown(container.querySelector('input'), KeyCode.BACKSPACE);
    expect(onChange).not.toHaveBeenCalled();

    console.log('after 200ms');
    act(() => {
      jest.runAllTimers();
    });
    keyDown(container.querySelector('input'), KeyCode.BACKSPACE);
    expect(onChange).toHaveBeenCalledWith([], expect.anything());

    jest.useRealTimers();
  });

  it('show placeholder when searchValue is controlled', () => {
    const { container } = render(
      <Select mode="multiple" searchValue="light" placeholder="bamboo" />,
    );
    expect(container.querySelector('.rc-select-placeholder')).toHaveStyle({
      visibility: 'visible',
    });
    toggleOpen(container);
    expect(container.querySelector('.rc-select-placeholder')).toBeFalsy();
  });

  it('clear input when popup closed', () => {
    const { container } = render(
      <Select mode="multiple" options={[{ value: 'light' }]} showSearch />,
    );
    toggleOpen(container);
    fireEvent.change(container.querySelector('input'), { target: { value: 'bamboo' } });
    expect(container.querySelector('input')).toHaveValue('bamboo');

    // Close and open again
    toggleOpen(container);
    fireEvent.blur(container.querySelector('input'));
    toggleOpen(container);
    expect(container.querySelector('input')).toHaveValue('');
  });

  it('ajax update should keep options', () => {
    const onChange = jest.fn();

    const renderDemo = (props?: any) => (
      <Select
        labelInValue
        mode="multiple"
        options={[{ value: 'light', label: 'Light', option: 2333 }]}
        onChange={onChange}
        showSearch
        {...props}
      />
    );

    const { container, rerender } = render(renderDemo());

    // First select
    toggleOpen(container);
    selectItem(container, 0);
    expect(onChange).toHaveBeenCalledWith(
      [{ label: 'Light', value: 'light' }],
      [{ label: 'Light', value: 'light', option: 2333 }],
    );
    onChange.mockReset();

    // Next select
    rerender(renderDemo({ options: [{ value: 'bamboo', label: 'Bamboo', option: 444 }] }));
    toggleOpen(container);
    selectItem(container, 0);
    expect(onChange).toHaveBeenCalledWith(
      [
        { label: 'Light', value: 'light' },
        { label: 'Bamboo', value: 'bamboo' },
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

    expect(container.querySelector('input')).not.toHaveAttribute('readOnly');
  });

  it('correctly handles the `tabIndex` prop', () => {
    const { container } = render(
      <Select mode="multiple" options={[{ value: 'bamboo' }, { value: 'light' }]} tabIndex={0} />,
    );
    expect(container.querySelector('.rc-select')).not.toHaveAttribute('tabindex');

    expect(container.querySelector('input')).toHaveAttribute('tabindex', '0');
  });

  it('should render title by default', () => {
    const { container } = render(
      <Select mode="multiple" options={[{ value: 'title' }]} value={['title']} />,
    );
    expect(container.querySelector('.rc-select-selection-item').getAttribute('title')).toBe(
      'title',
    );
  });

  it('should not render title by default when label is ReactNode', () => {
    const { container } = render(
      <Select mode="multiple" options={[{ value: '1', label: <div>label</div> }]} value={['1']} />,
    );
    expect(container.querySelector('.rc-select-selection-item').getAttribute('title')).toBeFalsy();
  });

  it('disabled should not show remove icon', () => {
    const { container } = render(
      <Select mode="multiple" value={[1]}>
        <Option value={1} disabled>
          1
        </Option>
      </Select>,
    );

    expect(container.querySelector('.rc-select-item-remove')).toBeFalsy();
  });

  it('do not crash if value not in options when removing option', () => {
    const onChange = jest.fn();
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
        onChange={onChange}
      >
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
      </Select>,
    );
    expect(findSelection(container, 0).textContent).toEqual('value not in options');
    removeSelection(container, 0);
    expect(onChange).toHaveBeenCalledWith([], expect.anything());
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

    expect(wrapper1.container.querySelector('.rc-select-item')).toBeFalsy();
    expect(wrapper2.container.querySelector('.rc-select-item')).toBeFalsy();
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

      expect(findSelection(container, 0).textContent).toBe('BAMBOO');
      expect(findSelection(container, 1).textContent).toBe('LITTLE');
      expect(container.querySelectorAll('.rc-select-item-option-content')[0].textContent).toBe(
        'Bamboo',
      );
      expect(container.querySelectorAll('.rc-select-item-option-content')[1].textContent).toBe(
        'Little',
      );
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
      expect(container.querySelectorAll('.rc-select-item-option-state-icon')[0].textContent).toBe(
        '✓',
      );
      selectItem(container, 0);
      expect(container.querySelectorAll('.rc-select-item-option-state-icon')[0].textContent).toBe(
        '',
      );
    });
  });

  describe('autoClearSearchValue', () => {
    it('search value should not show when autoClearSearchValue is undefined', () => {
      const { container } = render(
        <Select mode="multiple" open={false} showSearch={true} searchValue="test" />,
      );
      expect(container.querySelector('input')).toHaveValue('');
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
      expect(container.querySelector('input')).toHaveValue('test');
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
      expect(container.querySelector('input')).toHaveValue('test');
    });
    it('search value should clear when autoClearSearchValue is true', () => {
      const { container } = render(
        <Select mode="multiple" autoClearSearchValue={true} showSearch={true} searchValue="test" />,
      );
      toggleOpen(container);
      toggleOpen(container);
      expect(container.querySelector('input')).toHaveValue('');
    });

    it('should not close dropdown when mousedown on input in multiple mode (text selection)', () => {
      const { container } = render(
        <Select mode="multiple" showSearch options={[{ value: 'light' }]} />,
      );

      const input = container.querySelector('input') as HTMLInputElement;

      // Open dropdown first
      toggleOpen(container);
      expectOpen(container, true);

      // Start interaction from input (simulate starting text selection / cursor move)
      fireEvent.mouseDown(input);

      expectOpen(container, true);
    });
  });
});
