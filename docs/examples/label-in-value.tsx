import Select from 'rc-select';
import React from 'react';

const { Option } = Select;

export default () => {
  function handleChange(value) {
    console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
  }

  return (
    <Select
      labelInValue
      // defaultValue={{ value: 1 }}
      style={{ width: 120 }}
      mode="multiple"
      onChange={handleChange}
    >
      <Option key={1} value={1}>
        Jack (100)
      </Option>
      <Option key={2} value={2}>
        Lucy (101)
      </Option>
    </Select>
  )
}