import React from 'react';
import Select from '@rc-component/select';
import '../../assets/index.less';

const tokenSeparators = (input: string): string[] => {
  const tokens: string[] = [];
  const regex = /"([^"]*)"|([^,\n]+)/g;
  let m: RegExpExecArray | null = regex.exec(input);
  while (m !== null) {
    tokens.push((m[1] ?? m[2]).trim());
    m = regex.exec(input);
  }
  return tokens.filter(Boolean);
};

const Demo: React.FC = () => (
  <>
    <h2>自定义分词（引号感知）</h2>
    <Select
      mode="tags"
      style={{ width: '100%' }}
      tokenSeparators={tokenSeparators}
      placeholder='Try paste: "San Francisco, CA", New York'
    />
  </>
);

export default Demo;
