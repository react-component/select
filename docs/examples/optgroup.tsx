/* eslint-disable no-console */
import React from 'react';
import Select from 'rc-select';
import '../../assets/index.less';

function onChange(value, option) {
  console.log(`selected ${value}`, option);
}

const Test = () => (
  <div>
    <h2>Select OptGroup</h2>
    <div style={{ width: 300 }}>
      <Select
        placeholder="placeholder"
        defaultValue="lucy"
        style={{ width: 500 }}
        onChange={onChange}
        options={[{
          label: 'manager',
          options: [{
            label: 'jack',
            value: 'jack',
          }, {
            label: 'lucy',
            value: 'lucy',
          }],
        }, {
          label: 'engineer',
          options: [{
            label: 'yiminghe',
            value: 'yiminghe',
          }],
        }, {
          label: 'empty options group',
          options: undefined
        }]}
      />
    </div>
  </div>
);

export default Test;
/* eslint-enable */
