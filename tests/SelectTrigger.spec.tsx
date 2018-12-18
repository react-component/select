import { mount, render } from 'enzyme';
import React from 'react';
import SelectTrigger from '../src/SelectTrigger';

describe('SelectTrigger', () => {
  it('renders correctly', () => {
    const wrapper = render(
      <SelectTrigger prefixCls="rc-select" transitionName="slide">
        <div>foo</div>
      </SelectTrigger>,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('set popupTransitionName if animation given', () => {
    const wrapper = mount(
      <SelectTrigger prefixCls="rc-select" animation="slide-up">
        <div>foo</div>
      </SelectTrigger>,
    );
    // HACK
    expect((wrapper.find('Trigger').props() as any).popupTransitionName).toBe(
      'rc-select-dropdown-slide-up',
    );
  });
});
