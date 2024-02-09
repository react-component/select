import { mount } from 'enzyme';
import * as React from 'react';
import Select, { OptGroup, Option } from '../src';

describe('Select.Group', () => {
  it('group name support search', () => {
    const wrapper = mount(
      <Select showSearch>
        <OptGroup label="zombiej">
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </OptGroup>
      </Select>,
    );

    wrapper.find('.rc-select-selection-search-input').simulate('change', { target: { value: 'zombiej' } });
    expect(wrapper.find('List').props().data).toEqual([
      expect.objectContaining({ group: true, data: expect.objectContaining({ label: 'zombiej' }) }),
      expect.objectContaining({ data: expect.objectContaining({ value: '1' }) }),
      expect.objectContaining({ data: expect.objectContaining({ value: '2' }) }),
    ]);
  });

  it('group child option support search', () => {
    const wrapper = mount(
      <Select showSearch>
        <OptGroup label="zombiej">
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </OptGroup>
      </Select>,
    );

    wrapper.find('.rc-select-selection-search-input').simulate('change', { target: { value: '1' } });
    expect(wrapper.find('List').props().data).toHaveLength(2);
  });

  describe('group title', () => {
    it('label as title', () => {
      const wrapper = mount(
        <Select open>
          <OptGroup label="zombiej" />
        </Select>,
      );

      expect(wrapper.find('.rc-select-item-group').prop('title')).toEqual('zombiej');
    });

    it('customize title', () => {
      const wrapper = mount(
        <Select open>
          <OptGroup label="zombiej" title="bamboo" />
        </Select>,
      );

      expect(wrapper.find('.rc-select-item-group').prop('title')).toEqual('bamboo');
    });

    it('title as undefined', () => {
      const wrapper = mount(
        <Select open>
          <OptGroup label={<span>zombiej</span>} />
        </Select>,
      );

      expect(wrapper.find('.rc-select-item-group').prop('title')).toBeUndefined();
    });
  });

  it('group options exist undefined/null', () => {
    const wrapper = mount(
      <Select
          open
          options={[
            {
              label: 'zombiej',
              options: [
                { label: 'jackson', value: 'jackson' },
              ],
            },
            {
              label: 'bamboo',
              options: undefined,
            },
            {
              label: 'mocha',
              options: null,
            }
        ]}
      />
    );

    expect(wrapper.find('.rc-select-item-group').length).toEqual(3);
    expect(wrapper.find('.rc-select-item-option').length).toEqual(1);

    expect(wrapper.find('.rc-select-item').at(2).prop('title')).toEqual('bamboo');
    expect(wrapper.find('.rc-select-item').at(3).prop('title')).toEqual('mocha');
  })
});
