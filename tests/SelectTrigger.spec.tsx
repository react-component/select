import { mount } from 'enzyme';
import React from 'react';
import SelectTrigger from '../src/SelectTrigger';

describe('Select.Trigger', () => {
  it('set popupTransitionName if animation given', () => {
    const SimpleSelectTrigger = SelectTrigger as any;

    const wrapper = mount(
      <SimpleSelectTrigger prefixCls="rc-select" animation="slide-up">
        <div>foo</div>
      </SimpleSelectTrigger>,
    );

    expect(wrapper.find('Trigger').props().popupTransitionName).toBe('rc-select-dropdown-slide-up');
  });
});
