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

    wrapper.find('input').simulate('change', { target: { value: 'zombiej' } });
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

    wrapper.find('input').simulate('change', { target: { value: '1' } });
    expect(wrapper.find('List').props().data).toHaveLength(2);
  });
});
