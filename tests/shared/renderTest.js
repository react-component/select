/* eslint-disable no-undef */
import React from 'react';
import Select from '../../src/Select';
import Option from '../../src/Option';
import { shallow, render } from 'enzyme';

export default function maxTagTextLengthTest(mode) {
  describe('render', () => {
    it('truncates values by maxTagTextLength', () => {
      const wrapper = render(
        <Select
          {...{ [mode]: true } }
          value={['one', 'two']}
          maxTagTextLength={2}
        >
          <Option value="one">One</Option>
          <Option value="two">Two</Option>
        </Select>
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('truncates tags by maxTagCount', () => {
      const wrapper = render(
        <Select
          {...{ [mode]: true } }
          value={['one', 'two', 'three']}
          maxTagCount={2}
        >
          <Option value="one">One</Option>
          <Option value="two">Two</Option>
          <Option value="three">Three</Option>
        </Select>
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('truncates tags by maxTagCount while maxTagCount is 0', () => {
      const wrapper = render(
        <Select
          {...{ [mode]: true } }
          value={['one', 'two', 'three']}
          maxTagCount={0}
        >
          <Option value="one">One</Option>
          <Option value="two">Two</Option>
          <Option value="three">Three</Option>
        </Select>
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('truncates tags by maxTagCount and show maxTagPlaceholder', () => {
      const wrapper = render(
        <Select
          {...{ [mode]: true } }
          value={['one', 'two', 'three']}
          maxTagCount={2}
          maxTagPlaceholder={<span>Omitted</span>}
        >
          <Option value="one">One</Option>
          <Option value="two">Two</Option>
          <Option value="three">Three</Option>
        </Select>
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('truncates tags by maxTagCount and show maxTagPlaceholder function', () => {
      const maxTagPlaceholder = (omittedValues) => {
        return (
          <span>
            {omittedValues.length} values omitted
          </span>
        );
      };
      const wrapper = render(
        <Select
          {...{ [mode]: true } }
          value={['one', 'two', 'three']}
          maxTagCount={2}
          maxTagPlaceholder={maxTagPlaceholder}
        >
          <Option value="one">One</Option>
          <Option value="two">Two</Option>
          <Option value="three">Three</Option>
        </Select>
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('render animation', () => {
      const wrapper = shallow(
        <Select
          {...{ [mode]: true } }
          choiceTransitionName="slide-up"
        >
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
      );

      expect(wrapper).toMatchSnapshot();
    });
  });
}
