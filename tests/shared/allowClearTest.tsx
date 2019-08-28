import { render } from 'enzyme';
import * as React from 'react';
import Select from '../../src';

export default function allowClearTest(mode: any, value: any) {
  describe('allowClear', () => {
    it('renders correctly', () => {
      const wrapper = render(<Select mode={mode} value={value} allowClear />);
      expect(wrapper.find('.rc-select-clear-icon').length).toBeTruthy();
    });
  });
}
