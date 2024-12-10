import type { OptionListProps, RefOptionListProps } from '@/OptionList';
import { fireEvent, render } from '@testing-library/react';
import { forwardRef, act } from 'react';
import BaseSelect from '../src/BaseSelect';

const OptionList = forwardRef<RefOptionListProps, OptionListProps>(() => (
  <div className="popup">Popup</div>
));

describe('BaseSelect', () => {
  it('customized inputElement should trigger popup properly', () => {
    const { container } = render(
      <BaseSelect
        prefixCls="rc-select"
        getRawInputElement={() => (
          <a className="trigger" href="#">
            trigger
          </a>
        )}
        OptionList={OptionList}
        displayValues={[]}
        emptyOptions
        id="test"
        onDisplayValuesChange={() => {}}
        onSearch={() => {}}
        searchValue=""
      />,
    );
    expect(container.querySelector('div.popup')).toBeFalsy();
    fireEvent.click(container.querySelector('a.trigger'));
    expect(container.querySelector('div.popup')).toBeTruthy();
    fireEvent.mouseDown(container.querySelector('a.trigger'));
    expect(container.querySelector('div.rc-select-dropdown-hidden')).toBeFalsy();
    fireEvent.click(container.querySelector('a.trigger'));
    expect(container.querySelector('div.rc-select-dropdown-hidden')).toBeTruthy();
  });

  it('customized inputElement style should includes position: absolute', () => {
    jest.useFakeTimers();
    const { container } = render(
      <BaseSelect
        prefixCls="rc-select"
        OptionList={OptionList}
        displayValues={[]}
        emptyOptions
        id="test"
        onDisplayValuesChange={() => {}}
        onSearch={() => {}}
        searchValue=""
      />,
    );
    expect(container.querySelector('div.rc-select')).toBeTruthy();
    fireEvent.focus(container.querySelector('div.rc-select'));
    act(() => {
      jest.runAllTimers();
    });
    expect(
      getComputedStyle(container.querySelector(`span[aria-live=polite]`)).getPropertyValue(
        'position',
      ),
    ).toBe('absolute');
    jest.useRealTimers();
  });

  // https://github.com/ant-design/ant-design/issues/48833
  it('a11y not block of Chrome render', () => {
    jest.useFakeTimers();

    const { container } = render(
      <BaseSelect
        displayValues={Array.from({ length: 100 }).map((_, index) => ({
          key: index,
          value: index,
          label: index,
        }))}
        id="test"
        prefixCls="rc-select"
        onDisplayValuesChange={() => {}}
        searchValue=""
        onSearch={() => {}}
        OptionList={OptionList}
        emptyOptions
      />,
    );

    fireEvent.focus(container.querySelector('div.rc-select'));
    act(() => {
      jest.runAllTimers();
    });

    // We cut 50 count as hard code, its safe to adjust if refactor
    const contentTxt = container.querySelector('span[aria-live=polite]')?.textContent;
    expect(contentTxt).toBe(
      `${Array.from({ length: 50 })
        .map((_, index) => index)
        .join(', ')}, ...`,
    );

    jest.useRealTimers();
  });

  it('customize builtinPlacements should override default one', () => {
    const { container } = render(
      <BaseSelect
        prefixCls="rc-select"
        id="test"
        displayValues={[]}
        onDisplayValuesChange={() => {}}
        searchValue=""
        onSearch={() => {}}
        OptionList={OptionList}
        emptyOptions
        open
        // Test content
        builtinPlacements={{
          // placement not exist in `builtinPlacements`,
          // which means this will be same as empty one.
          // It's safe to test in other way if refactor
          fallback: {},
        }}
      />,
    );

    expect(container.querySelector('.rc-select-dropdown-placement-fallback')).toBeTruthy();
  });
});
