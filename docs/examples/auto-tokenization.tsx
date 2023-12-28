import React from 'react';
import Select from 'rc-select';
import '../../assets/index.less';

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const Demo: React.FC = () => (
  <>
    <h2>自动分词</h2>
    <Select
      mode="multiple"
      style={{ width: '100%' }}
      onChange={handleChange}
      tokenSeparators={[',']}
      options={Array.from({ length: 20 }, (_, i) => ({
        label: <span>中文{i}</span>,
        value: i.toString(),
      }))}
    />
  </>
);

export default Demo;
