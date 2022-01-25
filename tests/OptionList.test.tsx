import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import { act } from 'react-dom/test-utils';
import React from 'react';
import type { OptionListProps, RefOptionListProps } from '../src/OptionList';
import OptionList from '../src/OptionList';
import { injectRunAllTimers } from './utils/common';
import type { OptionsType } from '../src/interface';
import { fillFieldNames, flattenOptions } from '../src/utils/valueUtil';
import SelectContext from '../src/SelectContext';
import { BaseSelectContext } from '../src/hooks/useBaseProps';

jest.mock('../src/utils/platformUtil');

describe('OptionList', () => {
  injectRunAllTimers(jest);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function generateList({ options, values, ref, ...props }: any) {
    const fieldNames = fillFieldNames(props.fieldNames || {}, false);
    const flattenedOptions = flattenOptions(options, {
      fieldNames,
      childrenAsData: false,
    });

    return (
      <BaseSelectContext.Provider
        value={{
          prefixCls: 'rc-select',
          ...props,
        }}
      >
        <SelectContext.Provider
          value={{
            fieldNames,
            flattenOptions: flattenedOptions,
            options,
            onActiveValue: () => {},
            onSelect: () => {},
            rawValues: values || new Set(),
            ...props,
          }}
        >
          <div>
            <OptionList ref={ref} />
          </div>
        </SelectContext.Provider>
      </BaseSelectContext.Provider>
    );
  }

  it('renders correctly', () => {
    const wrapper = mount(
      generateList({
        options: [
          {
            key: 'group1',
            options: [{ value: '1', 'aria-label': 'value-1' }],
          },
          {
            key: 'group2',
            options: [{ value: '2' }],
          },
        ],
        values: new Set(['1']),
      }),
    );
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('save first active item', () => {
    const onActiveValue = jest.fn();

    mount(
      generateList({
        options: [{ value: '1' }, { value: '2' }],
        values: new Set('1'),
        onActiveValue,
      }),
    );

    expect(onActiveValue).toHaveBeenCalledWith('1', expect.anything(), expect.anything());
  });

  it('key operation', () => {
    const onActiveValue = jest.fn();
    const listRef = React.createRef<RefOptionListProps>();
    mount(
      generateList({
        options: [{ value: '1' }, { value: '2' }],
        onActiveValue,
        ref: listRef,
      }),
    );

    onActiveValue.mockReset();
    act(() => {
      listRef.current.onKeyDown({ which: KeyCode.DOWN } as any);
    });
    expect(onActiveValue).toHaveBeenCalledWith(
      '2',
      expect.anything(),
      expect.objectContaining({ source: 'keyboard' }),
    );

    onActiveValue.mockReset();
    act(() => {
      listRef.current.onKeyDown({ which: KeyCode.UP } as any);
    });
    expect(onActiveValue).toHaveBeenCalledWith(
      '1',
      expect.anything(),
      expect.objectContaining({ source: 'keyboard' }),
    );
  });

  it('key operation with fieldNames', () => {
    const onActiveValue = jest.fn();
    const toggleOpen = jest.fn();
    const onSelect = jest.fn();
    const listRef = React.createRef<RefOptionListProps>();
    mount(
      generateList({
        fieldNames: { value: 'foo', label: 'bar' },
        options: [{ foo: '1' }, { foo: '2' }],
        onActiveValue,
        onSelect,
        toggleOpen,
        ref: listRef,
      }),
    );

    onActiveValue.mockReset();
    act(() => {
      listRef.current.onKeyDown({ which: KeyCode.DOWN } as any);
    });
    expect(onActiveValue).toHaveBeenCalledWith(
      '2',
      expect.anything(),
      expect.objectContaining({ source: 'keyboard' }),
    );

    act(() => {
      listRef.current.onKeyDown({ which: KeyCode.ENTER } as any);
    });
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('2', expect.objectContaining({ selected: true }));

    onSelect.mockReset();
    onActiveValue.mockReset();
    act(() => {
      listRef.current.onKeyDown({ which: KeyCode.UP } as any);
    });
    expect(onActiveValue).toHaveBeenCalledWith(
      '1',
      expect.anything(),
      expect.objectContaining({ source: 'keyboard' }),
    );

    act(() => {
      listRef.current.onKeyDown({ which: KeyCode.ENTER } as any);
    });
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('1', expect.objectContaining({ selected: true }));
  });

  // mocked how we detect running platform in test environment
  it('special key operation on Mac', () => {
    const onActiveValue = jest.fn();
    const listRef = React.createRef<RefOptionListProps>();
    mount(
      generateList({
        options: [{ value: '1' }, { value: '2' }],
        onActiveValue,
        ref: listRef,
      }),
    );

    onActiveValue.mockReset();
    act(() => {
      listRef.current.onKeyDown({ which: KeyCode.N, ctrlKey: true } as any);
    });
    expect(onActiveValue).toHaveBeenCalledWith(
      '2',
      expect.anything(),
      expect.objectContaining({ source: 'keyboard' }),
    );

    onActiveValue.mockReset();
    act(() => {
      listRef.current.onKeyDown({ which: KeyCode.P, ctrlKey: true } as any);
    });
    expect(onActiveValue).toHaveBeenCalledWith(
      '1',
      expect.anything(),
      expect.objectContaining({ source: 'keyboard' }),
    );
  });

  it('hover to active', () => {
    const onActiveValue = jest.fn();
    const wrapper = mount(
      generateList({
        options: [{ value: '1' }, { value: '2' }],
        onActiveValue,
      }),
    );

    onActiveValue.mockReset();
    wrapper.find('.rc-select-item-option').last().simulate('mouseMove');
    expect(onActiveValue).toHaveBeenCalledWith(
      '2',
      expect.anything(),
      expect.objectContaining({ source: 'mouse' }),
    );

    // Same item not repeat trigger
    onActiveValue.mockReset();
    wrapper.find('.rc-select-item-option').last().simulate('mouseMove');
    expect(onActiveValue).not.toHaveBeenCalled();
  });

  it('Should prevent default with list mouseDown to avoid losing focus', () => {
    const wrapper = mount(
      generateList({
        options: [{ value: '1' }, { value: '2' }],
      }),
    );

    const preventDefault = jest.fn();
    wrapper.find('.rc-select-item-option').last().simulate('mouseDown', {
      preventDefault,
    });

    expect(preventDefault).toHaveBeenCalled();
  });

  it('Data attributes should be set correct', () => {
    const wrapper = mount(
      generateList({
        options: [
          { value: '1', label: 'my-label' },
          { value: '2', 'data-num': '123' },
        ],
      }),
    );

    expect(wrapper.find('.rc-select-item-option').last().prop('data-num')).toBe('123');
  });

  it('should render title defaultly', () => {
    const wrapper = mount(
      generateList({
        options: [{ value: '1', label: 'my-label' }],
      }),
    );
    expect(wrapper.find('.rc-select-item-option').first().prop('title')).toBe('my-label');
  });

  it('should render title', () => {
    const wrapper = mount(
      generateList({
        options: [{ value: '1', label: 'my-label', title: 'title' }],
      }),
    );
    expect(wrapper.find('.rc-select-item-option').first().prop('title')).toBe('title');
  });

  it('should not render title when title is empty string', () => {
    const wrapper = mount(
      generateList({
        options: [{ value: '1', label: 'my-label', title: '' }],
      }),
    );
    expect(wrapper.find('.rc-select-item-option').first().prop('title')).toBe('');
  });

  it('should render title from label when title is undefined', () => {
    const wrapper = mount(
      generateList({
        options: [{ value: '1', label: 'my-label', title: undefined }],
      }),
    );
    expect(wrapper.find('.rc-select-item-option').first().prop('title')).toBe('my-label');
  });

  it('should not render title defaultly when label is ReactNode', () => {
    const wrapper = mount(
      generateList({
        options: [{ value: '1', label: <div>label</div> }],
      }),
    );
    expect(wrapper.find('.rc-select-item-option').first().prop('title')).toBe(undefined);
  });
});
