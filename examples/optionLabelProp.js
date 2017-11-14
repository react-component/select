/* eslint no-console: 0 */

import React from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

function MultipleSelect() {
  const cases = {
    0: { name: 'Case 1' },
    1: { name: 'Case 2' },
    2: { name: 'Case 3' },
  };

  return (
    <div>
      <h2>Select optionLabelProp</h2>
      <Select style={{ width: 500 }} optionLabelProp="children" multiple allowClear>
        {
          Object.keys(cases).map(key => (
            <Option key={key} value={key}>{cases[key].name}</Option>
          ))
        }
      </Select>
    </div>
  );
}

ReactDOM.render(<MultipleSelect />, document.getElementById('__react-content'));
