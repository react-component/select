/* eslint no-console: 0 */

import React from 'react';
import Select, { Option, OptGroup } from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

function onChange(value, option) {
  console.log(`selected ${value}`, option);
}

const c1 = (
  <div>
    <h2>Select OptGroup</h2>
    <div style={{ width: 300 }}>
      <Select
        placeholder="placeholder"
        defaultValue="lucy"
        showSearch={false}
        style={{ width: 500 }}
        onChange={onChange}
      >
        <OptGroup label="manager">
          <Option value="jack" test-prop="jack-prop">
            <b
              style={{
                color: 'red',
              }}
            >
              jack
            </b>
          </Option>
          <Option value="lucy" test-prop="lucy-prop">lucy</Option>
        </OptGroup>
        <OptGroup label="engineer">
          <Option value="yiminghe" test-prop="yiminghe-prop">yiminghe</Option>
        </OptGroup>
      </Select>
    </div>
  </div>
);

ReactDOM.render(c1, document.getElementById('__react-content'));
