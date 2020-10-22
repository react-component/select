import React, { useState } from 'react';
import Select, { Option } from '../src';
import '../assets/index.less';
import { SortOrder, OptionCoreData } from '../src/interface';

const options = [
  {
    label: 'jack',
    value: 'jack',
  },
  {
    label: 'lucy',
    value: 'lucy',
  },
  {
    label: 'alpha',
    value: 'alpha',
  },
  {
    label: 'zoo',
    value: 'zoo',
  },
];

const incidencesStateResource = [
  { value: 4, label: 'Not Identified' },
  { value: 3, label: 'Closed' },
  { value: 2, label: 'Communicated' },
  { value: 6, label: 'Identified' },
  { value: 1, label: 'Resolved' },
  { value: 5, label: 'Cancelled' },
];

const sorterByLabel = (optionA, optionB) => optionA.label.localeCompare(optionB.label);

const sorterByChildren = (optionA, optionB) => optionA.children.localeCompare(optionB.children);

const sortOptions = [
  {
    label: '升序',
    value: 'ascend',
  },
  {
    label: '降序',
    value: 'descend',
  },
];

const compareFn = (input, option) =>
  (option.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0;

const Test = () => {
  const [sortOrder, setSortOrder] = useState('ascend');
  return (
    <div>
      <Select
        defaultValue="ascend"
        options={sortOptions}
        onChange={setSortOrder}
        value={sortOrder}
      />
      <div style={{ width: 300 }}>
        <h3>Select with options prop</h3>
        <Select
          defaultValue="lucy"
          style={{ width: 500 }}
          options={options}
          sorter={sorterByLabel}
          sortOrder={sortOrder as SortOrder}
        ></Select>
        <h3>Select with options children</h3>
        <Select
          defaultValue="lucy"
          style={{ width: 500 }}
          sorter={sorterByChildren}
          sortOrder={sortOrder as SortOrder}
        >
          {options.map(({ label, value }: OptionCoreData) => (
            <Option value={value}>{label}</Option>
          ))}
        </Select>
        <h3>Select with search</h3>
        <Select
          showSearch
          style={{ width: 500 }}
          sorter={sorterByLabel}
          sortOrder={sortOrder as SortOrder}
          optionFilterProp="label"
          filterOption={compareFn}
          options={incidencesStateResource}
        ></Select>
      </div>
    </div>
  );
};

export default Test;
