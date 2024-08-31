import React from 'react';
import Select from '../src';

describe('Select.typescript', () => {
  it('Select.items', () => {
    const select = (
      <Select
        onSelect={(value: string) => {
          console.log(value);
        }}
      >
        <Select.Option value="jack">jack</Select.Option>
      </Select>
    );

    expect(select).toBeTruthy();
  });

  it('Select.items Customizable ValueType', () => {
    const select = (
      <Select<string, { value: string; title: string }>
        defaultValue="TEAM_1"
        showSearch
        style={{ width: 200 }}
        optionFilterProp="children"
        onSelect={(_, option) => {
          console.log(option);
        }}
        filterOption={(input, option) =>
          (option && option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0) ?? false
        }
      >
        <Select.Option key="TEAM_1" value="TEAM_1" title="Team 1">
          Team 131
        </Select.Option>
        ))
      </Select>
    );

    expect(select).toBeTruthy();
  });
});
