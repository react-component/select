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
});
