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
    // const input = wrapper.find('input');
    const input = container.querySelector('input');
    // input.simulate('change', {
    //   target: {
    //     value: '1',
    //   },
    // });
    fireEvent.change(input, {
      target: {
        value: '1',
      },
    });

    // expect(wrapper.find('.rc-select').hasClass('rc-select-open')).toBeTruthy();
    expect(container.querySelector('.rc-select')).toHaveClass('rc-select-open');
    // expect(wrapper.find('input').props().value).toBe('1');
    expect(container.querySelector('input')).toHaveValue('1');
    // wrapper.find('.rc-select-item-option').first().simulate('click');
    fireEvent.click(container.querySelector('.rc-select-item-option'));
    // expect(wrapper.find('input').props().value).toBe(mode === 'single' ? '' : '1');
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
    // const input = wrapper.find('input');
    const input = container.querySelector('input');
    // input.simulate('change', {
    //   target: {
    //     value: '1',
    //   },
    // });
    fireEvent.change(input, {
      target: {
        value: '1',
      },
    });

    // expect(wrapper.find('.rc-select').hasClass('rc-select-open')).toBeTruthy();
    expect(container.querySelector('.rc-select')).toHaveClass('rc-select-open');
    // expect(wrapper.find('input').props().value).toBe('1');
    expect(container.querySelector('input')).toHaveValue('1');
    // wrapper.find('.rc-select-item-option').first().simulate('click');
    fireEvent.click(container.querySelector('.rc-select-item-option'));
    // expect(wrapper.find('input').props().value).toBe('');
    expect(container.querySelector('input')).toHaveValue('');
  });
}
