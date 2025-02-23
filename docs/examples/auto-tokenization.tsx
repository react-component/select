import React from 'react';
import Select from '@rc-component/select';
import '../../assets/index.less';

const Demo: React.FC = () => (
  <>
    <h2>自动分词</h2>
    <Select
      mode="tags"
      maxCount={3}
      style={{ width: '100%' }}
      tokenSeparators={[',']}
      options={Array.from({ length: 20 }, (_, i) => ({ label: i.toString(), value: i.toString() }))}
    />
  </>
);

export default Demo;
