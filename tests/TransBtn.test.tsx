import { mount } from 'enzyme';
import React from 'react';
import TransBtn from '../src/TransBtn';

describe('TransBtn', () => {
  it('should use customizeIcon when provided', () => {
    const wrapper = mount(
      <TransBtn
        className="rc-select-option-state"
        customizeIcon={<span className="my-transbtn-icon-class" />}
      >
        Button Label
      </TransBtn>,
    );

    expect(wrapper.find('.my-transbtn-icon-class').length).toBeTruthy();
  });
});
