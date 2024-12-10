import type { OptionListProps, RefOptionListProps } from '@/OptionList';
import { fireEvent, render } from '@testing-library/react';
import { forwardRef } from 'react';
import BaseSelect from '../src/BaseSelect';
import Select, { Option } from '../src';

const OptionList = forwardRef<RefOptionListProps, OptionListProps>(() => (
  <div className="popup">Popup</div>
));

describe('Select.Blur', () => {
  it('mode with undefined, onBlur source is blur', () => {
    const onSearch = jest.fn();
    const { container } = render(
      <BaseSelect
        prefixCls="rc-select"
        id="test"
        displayValues={[]}
        onDisplayValuesChange={() => {}}
        searchValue="1"
        showSearch
        onSearch={onSearch}
        OptionList={OptionList}
        emptyOptions
      />,
    );
    expect(container.querySelector('div.rc-select')).toBeTruthy();
    fireEvent.change(container.querySelector('input'), { target: { value: '2' } });
    expect(onSearch).toHaveBeenCalledWith('2', { source: 'typing' });
    fireEvent.blur(container.querySelector('div.rc-select'));
    expect(onSearch).toHaveBeenCalledWith('', { source: 'blur' });
  });

  it('mode with multiple, onBlur source is blur', () => {
    const onSearch = jest.fn();
    const { container } = render(
      <BaseSelect
        prefixCls="rc-select"
        mode="multiple"
        id="test"
        displayValues={[]}
        onDisplayValuesChange={() => {}}
        searchValue="1"
        showSearch
        onSearch={onSearch}
        OptionList={OptionList}
        emptyOptions
      />,
    );
    expect(container.querySelector('div.rc-select')).toBeTruthy();
    fireEvent.change(container.querySelector('input'), { target: { value: '2' } });
    expect(onSearch).toHaveBeenCalledWith('2', { source: 'typing' });
    fireEvent.blur(container.querySelector('div.rc-select'));
    expect(onSearch).toHaveBeenCalledWith('', { source: 'blur' });
  });

  it('click item and blur should trigger onBlur but not trigger onSearch', () => {
    const onSearch = jest.fn();
    const onBlur = jest.fn();

    const Demo = () => (
      <Select onSearch={onSearch} showSearch onBlur={onBlur}>
        <Option value="11">11</Option>
        <Option value="22">22</Option>
        <Option value="33">33</Option>
      </Select>
    );

    const { container } = render(<Demo />);
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.click(
      container.querySelectorAll('.rc-select-dropdown .rc-select-item-option-content')[0],
    );
    fireEvent.blur(input);
    expect(container.querySelector('.rc-select-dropdown-hidden')).toBeTruthy();
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
