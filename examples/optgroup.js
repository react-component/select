'use strict';

import React from 'react';
import Select, {Option, OptGroup} from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

function handleChange(value) {
  console.log('selected ' + value);
}

var c1 = (
  <div>
    <h2>Select OptGroup</h2>
    <div style={{width: 300}}>
      <Select defaultValue="lucy"
        showSearch={false}
        style={{width:500}}
        onChange={handleChange}>
        <OptGroup label="manager">
          <Option value="jack">
            <b style={{
              color: 'red'
            }}>jack</b>
          </Option>
          <Option value="lucy">lucy</Option>
        </OptGroup>
        <OptGroup label="engineer">
          <Option value="yiminghe">yiminghe</Option>
        </OptGroup>
      </Select>
    </div>
  </div>
);

ReactDOM.render(c1, document.getElementById('__react-content'));
