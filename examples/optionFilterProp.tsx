import * as React from 'react';
import Select, { Option } from '../src';
import '../assets/index.less';

const Test = () => {
  const [value, setValue] = React.useState<string>('');

  return (
    <div>
      <h2>Select optionFilterProp</h2>
      <div style={{ width: 300 }}>
        <Select
          defaultValue="张三"
          style={{ width: 500 }}
          placeholder="placeholder"
          optionFilterProp="desc"
          onChange={(val: string) => {
            setValue(val);
          }}
          value={value}
          showSearch
        >
          <Option value="张三" desc="张三 zhang san">
            张三
          </Option>
          <Option value="李四" desc="李四 li si">
            李四
          </Option>
          <Option value="王五" desc="王五 wang wu">
            王五
          </Option>
        </Select>
      </div>
      {value}
    </div>
  );
};

export default Test;
