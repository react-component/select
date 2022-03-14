import React from 'react';
import Select from 'rc-select';
import '../../assets/index.less';

const data: { value: number; label: string }[] = [];
for (let i = 0; i < 10; i += 1) {
  data.push({
    value: i,
    label: `label ${i}`,
  });
}

const singleDefaultValue = 'x2';

const multipleDefaultValue = [{ label: 'label x1', value: 'x1' }, 'x2'];

function Test() {
  return (
    <div>
      <h2>Select alternativeLabel</h2>
      <Select
        style={{ width: 500 }}
        allowClear
        options={data}
        alternativeLabel={<span style={{ color: 'red' }}>error option</span>}
        defaultValue={singleDefaultValue}
      />
      <br />
      <Select
        style={{ width: 500 }}
        mode="multiple"
        allowClear
        options={data}
        alternativeLabel={<span style={{ color: 'red' }}>error option</span>}
        defaultValue={multipleDefaultValue}
      />
    </div>
  );
}

export default Test;
