import React, { FC } from 'react';
import Select from 'rc-select';

const SuffixDemo: FC = () => {
  return (
    <Select suffix=":)">
      {Array(10).fill(1).map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Select.Option key={`pick me ${index}`} value={index}>{`pick me ${index}`}</Select.Option>
      ))}
    </Select>
  )
}

export default SuffixDemo;