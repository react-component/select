import { mount } from 'enzyme';
import * as React from 'react';
import Option from '../../src/Option';
import Select from '../../src/Select';

export default function inputFilterTest(mode: any) {
  it('should keep input filter after select when autoClearSearchValue is false', () => {
    const wrapper = mount(
      <Select mode={mode} autoClearSearchValue={false} showSearch>
        <Option value="11">11</Option>
        <Option value="12">12</Option>
        <Option value="22">22</Option>
      </Select>,
    );
    const input = wrapper.find('input');
    input.simulate('change', {
      target: {
        value: '1',
      },
    });

    expect(wrapper.find('.rc-select').hasClass('rc-select-open')).toBeTruthy();
    expect(wrapper.find('input').props().value).toBe('1');
    wrapper
      .find('.rc-select-item-option')
      .first()
      .simulate('click');
    expect(wrapper.find('input').props().value).toBe(mode === 'single' ? '' : '1');
  });

  it('should clear input filter after select', () => {
    const wrapper = mount(
      <Select mode={mode} showSearch>
        <Option value="11">11</Option>
        <Option value="12">12</Option>
        <Option value="22">22</Option>
      </Select>,
    );
    const input = wrapper.find('input');
    input.simulate('change', {
      target: {
        value: '1',
      },
    });

    expect(wrapper.find('.rc-select').hasClass('rc-select-open')).toBeTruthy();
    expect(wrapper.find('input').props().value).toBe('1');
    wrapper
      .find('.rc-select-item-option')
      .first()
      .simulate('click');
    expect(wrapper.find('input').props().value).toBe('');
  });
}
