import React from 'react';
import Select from '../src';
import { convertChildrenToData } from '../src/utils/legacyUtil';
import { flattenOptions } from '../src/utils/valueUtil';

describe('Utils', () => {
  describe('legacy', () => {
    it('convertChildrenToData', () => {
      const node = (
        <Select>
          <Select.Option key="light">Light</Select.Option>
          <Select.OptGroup label="Group">
            <Select.Option value="bamboo">Bamboo</Select.Option>
          </Select.OptGroup>
          {null}
          2333
          <span>Not Good</span>
        </Select>
      );

      expect(convertChildrenToData(node.props.children)).toEqual([
        { key: 'light', label: 'Light' },
        { key: null, label: 'Group', options: [{ key: null, label: 'Bamboo', value: 'bamboo' }] },
        { key: null, label: 'Not Good' },
      ]);
    });
  });

  describe('value', () => {
    it('flattenOptions', () => {
      const raw = [{ key: 1 }, { options: [{ key: 2 }] }];
      flattenOptions();
    });
  });
});
