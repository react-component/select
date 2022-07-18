import { fireEvent, render } from '@testing-library/react';
import BaseSelect from '../src/BaseSelect';
import { forwardRef } from 'react';
import type { OptionListProps, RefOptionListProps } from '@/OptionList';

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
    jest.runAllTimers();
    expect(
      getComputedStyle(container.querySelector(`span[aria-live=polite]`)).getPropertyValue(
        'position',
      ),
    ).toBe('absolute');
    jest.useRealTimers();
  });
});
