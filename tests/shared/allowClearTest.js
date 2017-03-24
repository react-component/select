/* eslint-disable no-undef */
import React from 'react';
import { render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import Select from '../../src/Select';

export default function allowClearTest(mode) {
  describe('allowClear', () => {
    it('renders correctly', () => {
      const comboboxWrapper = render(<Select {...({ [mode]: true })} allowClear />);
      expect(renderToJson(comboboxWrapper)).toMatchSnapshot();
    });
  });
}
