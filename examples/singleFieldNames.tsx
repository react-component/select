/* eslint-disable no-console */
import React from 'react';
import Select from '../src';
import '../assets/index.less';
import './single.less';

export default () => {
  return (
    <Select
      style={{ width: 500 }}
      onChange={console.log}
      fieldNames={{
        label: 'fieldLabel',
        value: 'fieldValue',
        options: 'fieldOptions',
      }}
      options={
        [
          {
            fieldLabel: 'Group',
            fieldOptions: [
              {
                fieldLabel: 'Bamboo',
                fieldValue: 'bamboo',
              },
              {
                fieldLabel: 'Light',
                fieldValue: 'light',
              },
            ],
          },
        ] as any
      }
    />
  );
};
/* eslint-enable */
