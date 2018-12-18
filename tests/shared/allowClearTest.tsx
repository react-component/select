import { render } from 'enzyme';
import React from 'react';
import Select from '../../src/Select';

export default function allowClearTest(mode) {
  describe('allowClear', () => {
    it('renders correctly', () => {
      const wrapper = render(<Select {...{ [mode]: true }} allowClear={true} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
}
