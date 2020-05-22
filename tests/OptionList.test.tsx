import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import { act } from 'react-dom/test-utils';
import React from 'react';
import OptionList, { OptionListProps, RefOptionListProps } from '../src/OptionList';
import { injectRunAllTimers } from './utils/common';
import { OptionsType } from '../src/interface';
import { flattenOptions } from '../src/utils/valueUtil';

describe('OptionList', () => {
  injectRunAllTimers(jest);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function generateList({
    options,
    ...props
  }: { options: OptionsType } & Partial<OptionListProps<OptionsType>> & { ref?: any }) {
    const flatten = flattenOptions(options);

    return (
      <div>
        <OptionList
          prefixCls="rc-select"
          onActiveValue={() => {}}
          values={new Set()}
          options={options}
          flattenOptions={flatten}
          {...(props as any)}
        />
      </div>
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

    expect(onActiveValue).toHaveBeenCalledWith('1', expect.anything());
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
    expect(onActiveValue).toHaveBeenCalledWith('2', expect.anything());

    onActiveValue.mockReset();
    act(() => {
      listRef.current.onKeyDown({ which: KeyCode.UP } as any);
    });
    expect(onActiveValue).toHaveBeenCalledWith('1', expect.anything());
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
    wrapper
      .find('.rc-select-item-option')
      .last()
      .simulate('mouseMove');
    expect(onActiveValue).toHaveBeenCalledWith('2', expect.anything());

    // Same item not repeat trigger
    onActiveValue.mockReset();
    wrapper
      .find('.rc-select-item-option')
      .last()
      .simulate('mouseMove');
    expect(onActiveValue).not.toHaveBeenCalled();
  });

  it('Should prevent default with list mouseDown to avoid losing focus', () => {
    const wrapper = mount(
      generateList({
        options: [{ value: '1' }, { value: '2' }],
      }),
    );

    const preventDefault = jest.fn();
    wrapper
      .find('.rc-select-item-option')
      .last()
      .simulate('mouseDown', {
        preventDefault,
      });

    expect(preventDefault).toHaveBeenCalled();
  });

  it('Data attributes should be set correct', () => {
    const wrapper = mount(
      generateList({
        options: [{ value: '1' }, { value: '2', 'data-num': '123' }],
      }),
    );

    expect(
      wrapper
        .find('.rc-select-item-option')
        .last()
        .prop('data-num'),
    ).toBe('123');
  });
});
