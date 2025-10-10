import * as React from 'react';
import SelectContent from '../src/SelectInput/Content';
import type { DisplayValueType } from '../src/interface';

const SelectContentExample = () => {
  const singleValue: DisplayValueType[] = [{ value: 'option1', label: 'Option 1' }];

  const multipleValues: DisplayValueType[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const emptyValues: DisplayValueType[] = [];

  return (
    <div>
      <h2>SelectContent Value Logic Examples</h2>

      <div>
        <h3>Single Mode with Value</h3>
        <SelectContent prefixCls="rc-select" multiple={false} value={singleValue} />
      </div>

      <div>
        <h3>Multiple Mode with Values</h3>
        <SelectContent prefixCls="rc-select" multiple={true} value={multipleValues} />
      </div>

      <div>
        <h3>Single Mode with Empty Values</h3>
        <SelectContent prefixCls="rc-select" multiple={false} value={emptyValues} />
      </div>

      <div>
        <h3>Multiple Mode with Empty Values</h3>
        <SelectContent prefixCls="rc-select" multiple={true} value={emptyValues} />
      </div>
    </div>
  );
};

export default SelectContentExample;
