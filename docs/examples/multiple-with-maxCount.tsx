/* eslint-disable no-console */
import React from 'react';
import Select from '@rc-component/select';
import '../../assets/index.less';

const Test: React.FC = () => {
  const [value, setValue] = React.useState<string[]>(['1']);

  const onChange = (v: any) => {
    setValue(v);
  };

  return (
    <>
      <h2>Multiple with maxCount</h2>
      <Select
        maxCount={4}
        mode="multiple"
        value={value}
        animation="slide-up"
        choiceTransitionName="rc-select-selection__choice-zoom"
        style={{ width: 500 }}
        optionFilterProp="children"
        optionLabelProp="children"
        placeholder="please select"
        onChange={onChange}
        options={Array.from({ length: 20 }, (_, i) => ({
          label: <span>中文{i}</span>,
          value: i.toString(),
        }))}
      />
    </>
  );
};

export default Test;
