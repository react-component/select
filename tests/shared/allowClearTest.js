/* eslint-disable no-undef */
import React from 'react';
import { render } from 'enzyme';
import Select from '../../src/Select';

export default function allowClearTest(mode) {
  describe('allowClear', () => {
    it('renders correctly', () => {
      const wrapper = render(<Select {...{ [mode]: true }} allowClear />);
      expect(wrapper).toMatchSnapshot();
    });
  });
}
