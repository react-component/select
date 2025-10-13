import * as React from 'react';
import Option from '../../src/Option';
import Select from '../../src/Select';
import { findSelection } from '../utils/common';
import { render } from '@testing-library/react';

export default function maxTagTextLengthTest(mode: any) {
  describe('max tag render', () => {
    it('truncates values by maxTagTextLength', () => {
      const { container } = render(
        <Select mode={mode} value={['one', 'two']} maxTagTextLength={2}>
          <Option value="one">One</Option>
          <Option value="two">Two</Option>
        </Select>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('truncates tags by maxTagCount', () => {
      const { container } = render(
        <Select mode={mode} value={['one', 'two', 'three']} maxTagCount={2}>
          <Option value="one">One</Option>
          <Option value="two">Two</Option>
          <Option value="three">Three</Option>
        </Select>,
      );

      expect(container.querySelectorAll('.rc-select-selection-item')).toHaveLength(3);
    });

    it('truncates tags by maxTagCount while maxTagCount is 0', () => {
      const { container } = render(
        <Select mode={mode} value={['one', 'two', 'three']} maxTagCount={0}>
          <Option value="one">One</Option>
          <Option value="two">Two</Option>
          <Option value="three">Three</Option>
        </Select>,
      );

      expect(container.querySelectorAll('.rc-select-selection-item')).toHaveLength(1);
      expect(findSelection(container).textContent).toEqual('+ 3 ...');
    });

    it('not display maxTagPlaceholder if maxTagCount not reach', () => {
      const { container } = render(
        <Select mode={mode} maxTagCount={2}>
          <Option value="one">One</Option>
          <Option value="two">Two</Option>
          <Option value="three">Three</Option>
        </Select>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('truncates tags by maxTagCount and show maxTagPlaceholder', () => {
      const { container } = render(
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

      expect(container.firstChild).toMatchSnapshot();
    });

    it('truncates tags by maxTagCount and show maxTagPlaceholder function', () => {
      const maxTagPlaceholder = (omittedValues) => (
        <span>{omittedValues.length} values omitted</span>
      );
      const { container } = render(
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

      expect(container.firstChild).toMatchSnapshot();
    });

    it('tagRender should work on maxTagPlaceholder', () => {
      const tagRender = jest.fn();
      const maxTagPlaceholder = (omittedValues) => `${omittedValues.length} values omitted`;
      render(
        <Select
          mode={mode}
          value={['one', 'two', 'three']}
          maxTagCount={2}
          tagRender={tagRender}
          maxTagPlaceholder={maxTagPlaceholder}
        >
          <Option value="one">One</Option>
          <Option value="two">Two</Option>
          <Option value="three">Three</Option>
        </Select>,
      );
      expect(tagRender).toHaveBeenCalledWith(
        expect.objectContaining({
          isMaxTag: false,
          label: 'One',
        }),
      );
      expect(tagRender).toHaveBeenCalledWith(
        expect.objectContaining({
          isMaxTag: false,
          label: 'Two',
        }),
      );
      expect(tagRender).toHaveBeenCalledWith(
        expect.objectContaining({
          isMaxTag: true,
          label: '1 values omitted',
        }),
      );
    });
  });
}
