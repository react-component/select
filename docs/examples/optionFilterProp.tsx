import * as React from 'react';
import Select, { Option } from '@rc-component/select';
import '../../assets/index.less';

const Test = () => {
  const [value, setValue] = React.useState<string>('张三');

  return (
    <div>
      <h2>Select optionFilterProp</h2>
      <div style={{ width: 300 }}>
        <Select
          style={{ width: 500 }}
          showSearch={{ optionFilterProp: ['value', 'pinyin'] }}
          placeholder="placeholder"
          onChange={(val: string) => {
            setValue(val);
          }}
          value={value}
        >
          <Option value="张三" pinyin="zhangsan">
            张三
          </Option>
          <Option value="李四" pinyin="lisi">
            李四
          </Option>
          <Option value="王五" pinyin="wangwu">
            王五
          </Option>
          <Option value="lisa" pinyin="lisa">
            lisa
          </Option>
        </Select>
      </div>
      {value}
    </div>
  );
};

export default Test;
