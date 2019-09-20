import { mount } from 'enzyme';
import * as React from 'react';
import Option from '../../src/Option';
import Select from '../../src/Select';
import { findSelection } from '../utils/common';

export default function maxTagTextLengthTest(mode: any) {
  describe('render', () => {
    it('truncates values by maxTagTextLength', () => {
      const wrapper = mount(
        <Select mode={mode} value={['one', 'two']} maxTagTextLength={2}>
          <Option value="one">One</Option>
          <Option value="two">Two</Option>
        </Select>,
      );

      expect(wrapper.render()).toMatchSnapshot();
    });

    it('truncates tags by maxTagCount', () => {
      const wrapper = mount(
        <Select mode={mode} value={['one', 'two', 'three']} maxTagCount={2}>
          <Option value="one">One</Option>
          <Option value="two">Two</Option>
          <Option value="three">Three</Option>
        </Select>,
      );

      expect(wrapper.find('.rc-select-selection-item')).toHaveLength(3);
    });

    it('truncates tags by maxTagCount while maxTagCount is 0', () => {
      const wrapper = mount(
        <Select mode={mode} value={['one', 'two', 'three']} maxTagCount={0}>
          <Option value="one">One</Option>
          <Option value="two">Two</Option>
          <Option value="three">Three</Option>
        </Select>,
      );

      expect(wrapper.find('.rc-select-selection-item')).toHaveLength(1);
      expect(findSelection(wrapper).text()).toEqual('+ 3 ...');
    });

    it('not display maxTagPlaceholder if maxTagCount not reach', () => {
      const wrapper = mount(
        <Select mode={mode} maxTagCount={2}>
          <Option value="one">One</Option>
          <Option value="two">Two</Option>
          <Option value="three">Three</Option>
        </Select>,
      );

      expect(wrapper.render()).toMatchSnapshot();
    });

    it('truncates tags by maxTagCount and show maxTagPlaceholder', () => {
      const wrapper = mount(
        <Select
          mode={mode}
          value={['one', 'two', 'three']}
          maxTagCount={2}
          maxTagPlaceholder={<span>Omitted</span>}
        >
          <Option value="one">One</Option>
          <Option value="two">Two</Option>
          <Option value="three">Three</Option>
        </Select>,
      );

      expect(wrapper.render()).toMatchSnapshot();
    });

    it('truncates tags by maxTagCount and show maxTagPlaceholder function', () => {
      const maxTagPlaceholder = omittedValues => <span>{omittedValues.length} values omitted</span>;
      const wrapper = mount(
        <Select
          mode={mode}
          value={['one', 'two', 'three']}
          maxTagCount={2}
          maxTagPlaceholder={maxTagPlaceholder}
        >
          <Option value="one">One</Option>
          <Option value="two">Two</Option>
          <Option value="three">Three</Option>
        </Select>,
      );

      expect(wrapper.render()).toMatchSnapshot();
    });
  });
}
