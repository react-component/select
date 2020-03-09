import React from 'react';
import Select from '../src';
import { convertChildrenToData } from '../src/utils/legacyUtil';
import { flattenOptions, getSeparatedContent } from '../src/utils/valueUtil';

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
        { key: 'light', value: 'light', children: 'Light' },
        {
          key: '__RC_SELECT_GRP__1__',
          label: 'Group',
          options: [{ key: null, children: 'Bamboo', value: 'bamboo' }],
        },
        { key: null, children: 'Not Good', value: null },
      ]);
    });
  });

  describe('value', () => {
    it('flattenOptions', () => {
      const raw = [{ key: 1 }, { options: [{ key: 2 }] }];
      expect(flattenOptions(raw)).toEqual([
        { key: 1, groupOption: false, data: { key: 1 } },
        { key: 'rc-index-key-1', group: true, data: { options: [{ key: 2 }] } },
        { key: 2, groupOption: true, data: { key: 2 } },
      ]);
    });

    describe('getSeparatedContent', () => {
      it('basic', () => {
        expect(getSeparatedContent('One,Two,Three', [','])).toEqual(['One', 'Two', 'Three']);
      });

      it('match', () => {
        expect(getSeparatedContent('1 2,3;4;5,,,,;6 7,8 ', [' ', ',', ';'])).toEqual([
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
        ]);
      });

      it('not match', () => {
        expect(getSeparatedContent('12312313123123', [' ', ','])).toEqual(null);
        expect(getSeparatedContent('12312313123123', [])).toEqual(null);
      });
    });
  });
});
