/* eslint-disable no-console */
import React from 'react';
import Select from '@rc-component/select';
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
        options={[
          {
            label: 'manager',
            className: 'group-custom-className',
            title: 'group-custom-class',
            options: [
              {
                label: 'jack',
                value: 'jack',
                className: 'jackClass1 jackClass2',
                title: 'jack-custom-Title',
              },
              { label: 'lucy', value: 'lucy' },
            ],
          },
          {
            label: 'engineer',
            options: [{ label: 'yiminghe', value: 'yiminghe' }],
          },
          {
            label: 'bamboo',
            options: undefined,
          },
          {
            label: 'mocha',
            options: null,
          },
        ]}
      />
    </div>
  </div>
);

export default Test;
/* eslint-enable */
