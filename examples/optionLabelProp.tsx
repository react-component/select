import React from 'react';
import Select from '../src';
import '../assets/index.less';

const data: { value: number; label: string; displayLabel: string }[] = [];
for (let i = 0; i < 10; i += 1) {
  data.push({
    value: i,
    label: `label ${i}`,
    displayLabel: `display ${i}`,
  });
}

function Test() {
  return (
    <div>
      <h2>Select optionLabelProp</h2>
      <Select
        style={{ width: 500 }}
        optionLabelProp="displayLabel"
        mode="multiple"
        allowClear
        options={data}
      />
    </div>
  );
}

export default Test;
