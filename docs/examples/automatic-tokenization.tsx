import React from 'react';
import Select from 'rc-select';
import '../../assets/index.less';

const options = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const App: React.FC = () => (
  <>
    <h2>自动分词</h2>
    <Select
      maxCount={3}
      mode="tags"
      style={{ width: '100%' }}
      onChange={handleChange}
      tokenSeparators={[',']}
      options={options}
    />
  </>
);

export default App;
