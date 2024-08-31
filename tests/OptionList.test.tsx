import KeyCode from 'rc-util/lib/KeyCode';
import React, { act } from 'react';
import { BaseSelectContext } from '../src/hooks/useBaseProps';
import type { RefOptionListProps } from '../src/OptionList';
import OptionList from '../src/OptionList';
import SelectContext from '../src/SelectContext';
import { fillFieldNames, flattenOptions } from '../src/utils/valueUtil';
import { injectRunAllTimers } from './utils/common';
import { createEvent, fireEvent, render } from '@testing-library/react';

jest.mock('../src/utils/platformUtil');

// Mock VirtualList
jest.mock('rc-virtual-list', () => {
  const OriReact = jest.requireActual('react');
  const OriList = jest.requireActual('rc-virtual-list').default;

  return OriReact.forwardRef((props, ref) => {
    const oriRef = OriReact.useRef();

    OriReact.useImperativeHandle(ref, () => ({
      ...oriRef.current,
      scrollTo: (arg) => {
        global.scrollToArgs = arg;
        oriRef.current.scrollTo(arg);
      },
    }));

    return <OriList {...props} ref={oriRef} />;
  });
});

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
            virtual: true,
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

  describe('renders correctly', () => {
    const sharedConfig = {
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
    };

    it('virtual', () => {
      const { container } = render(generateList(sharedConfig));
      expect(container.firstChild).toMatchSnapshot();
    });

    it('without virtual', () => {
      const { container } = render(
        generateList({
          ...sharedConfig,
          virtual: false,
        }),
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('save first active item', () => {
    const onActiveValue = jest.fn();

    render(
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
    render(
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
    render(
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
    render(
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
    const { container } = render(
      generateList({
        options: [{ value: '1' }, { value: '2' }],
        onActiveValue,
      }),
    );

    onActiveValue.mockReset();
    fireEvent.mouseMove(container.querySelector('.rc-select-item-option:last-child'));
    expect(onActiveValue).toHaveBeenCalledWith(
      '2',
      expect.anything(),
      expect.objectContaining({ source: 'mouse' }),
    );

    // Same item not repeat trigger
    onActiveValue.mockReset();
    fireEvent.mouseMove(container.querySelector('.rc-select-item-option:last-child'));
    expect(onActiveValue).not.toHaveBeenCalled();
  });

  it('Should prevent default with list mouseDown to avoid losing focus', () => {
    const { container } = render(
      generateList({
        options: [{ value: '1' }, { value: '2' }],
      }),
    );

    const preventDefault = jest.fn();
    const ele = container.querySelector('.rc-select-item-option:last-child');

    const mouseDownEvent = createEvent.mouseDown(ele);
    mouseDownEvent.preventDefault = preventDefault;
    fireEvent(ele, mouseDownEvent);

    expect(preventDefault).toHaveBeenCalled();
  });

  it('Data attributes should be set correct', () => {
    const { container } = render(
      generateList({
        options: [
          { value: '1', label: 'my-label' },
          { value: '2', 'data-num': '123' },
        ],
      }),
    );

    expect(
      container.querySelector('.rc-select-item-option:last-child').getAttribute('data-num'),
    ).toBe('123');
  });

  it('should render title defaultly', () => {
    const { container } = render(
      generateList({
        options: [{ value: '1', label: 'my-label' }],
      }),
    );
    expect(container.querySelector('.rc-select-item-option').getAttribute('title')).toBe(
      'my-label',
    );
  });

  it('should render title', () => {
    const { container } = render(
      generateList({
        options: [{ value: '1', label: 'my-label', title: 'title' }],
      }),
    );
    expect(container.querySelector('.rc-select-item-option').getAttribute('title')).toBe('title');
  });

  it('should not render title when title is empty string', () => {
    const { container } = render(
      generateList({
        options: [{ value: '1', label: 'my-label', title: '' }],
      }),
    );
    expect(container.querySelector('.rc-select-item-option').getAttribute('title')).toBe('');
  });

  it('should render title from label when title is undefined', () => {
    const { container } = render(
      generateList({
        options: [{ value: '1', label: 'my-label', title: undefined }],
      }),
    );
    expect(container.querySelector('.rc-select-item-option').getAttribute('title')).toBe(
      'my-label',
    );
  });

  it('should not render title defaultly when label is ReactNode', () => {
    const { container } = render(
      generateList({
        options: [{ value: '1', label: <div>label</div> }],
      }),
    );
    expect(container.querySelector('.rc-select-item-option').getAttribute('title')).toBe(null);
  });

  it('params to scrollIntoView should be object when key is pressed', () => {
    const listRef = React.createRef<RefOptionListProps>();
    const options = Array.from({ length: 20 }).map((v, i) => ({ value: i, label: i }));
    render(
      generateList({
        options,
        ref: listRef,
      }),
    );
    act(() => {
      listRef.current.onKeyDown({ which: KeyCode.DOWN } as any);
    });
    expect(global.scrollToArgs).toEqual({ index: 1 });
  });
});
