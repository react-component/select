import React from 'react';
import Select from '../src';
import '../assets/index.less';

const incidencesStateResource = [
  { value: 4, label: 'Not Identified' },
  { value: 3, label: 'Closed' },
  { value: 2, label: 'Communicated' },
  { value: 6, label: 'Identified' },
  { value: 1, label: 'Resolved' },
  { value: 5, label: 'Cancelled' },
];

const sorterByLabel = (optionA, optionB) => optionA.label.localeCompare(optionB.label);

const Test = () => (
  <div>
    <h3> with filter sort </h3>
    <Select
      showSearch
      style={{ width: 500 }}
      filterSort={sorterByLabel}
      optionFilterProp="label"
      options={incidencesStateResource}
    ></Select>
    <h3> without filter sort </h3>
    <Select
      showSearch
      style={{ width: 500 }}
      optionFilterProp="label"
      options={incidencesStateResource}
    />
  </div>
);

export default Test;
