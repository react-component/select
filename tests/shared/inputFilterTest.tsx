import * as React from 'react';
import Option from '../../src/Option';
import Select from '../../src/Select';
import { fireEvent, render } from '@testing-library/react';

export default function inputFilterTest(mode: any) {
  it('should keep input filter after select when autoClearSearchValue is false', () => {
    const { container } = render(
      <Select mode={mode} autoClearSearchValue={false} showSearch>
        <Option value="11">11</Option>
        <Option value="12">12</Option>
        <Option value="22">22</Option>
      </Select>,
    );
    const input = container.querySelector('input');
    fireEvent.change(input, {
      target: {
        value: '1',
      },
    });

    expect(container.querySelector('.rc-select')).toHaveClass('rc-select-open');
    expect(container.querySelector('input')).toHaveValue('1');
    fireEvent.click(container.querySelector('.rc-select-item-option'));
    expect(container.querySelector('input')).toHaveValue(mode === 'single' ? '' : '1');
  });

  it('should clear input filter after select', () => {
    const { container } = render(
      <Select mode={mode} showSearch>
        <Option value="11">11</Option>
        <Option value="12">12</Option>
        <Option value="22">22</Option>
      </Select>,
    );
    const input = container.querySelector('input');
    fireEvent.change(input, {
      target: {
        value: '1',
      },
    });

    expect(container.querySelector('.rc-select')).toHaveClass('rc-select-open');
    expect(container.querySelector('input')).toHaveValue('1');
    fireEvent.click(container.querySelector('.rc-select-item-option'));
    expect(container.querySelector('input')).toHaveValue('');
  });
}
