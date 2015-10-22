'use strict';

import React from 'react';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

function handleChange(value) {
  console.log('selected ' + value);
}

var c1 = (
  <div>
    <h2>Select placeholder</h2>
    <div style={{width: 300}}>
      <Select
        placeholder={<i>请下拉选择</i>}
        searchPlaceholder="输入过滤"
        style={{width:500}}
        onChange={handleChange}>
        <Option value="jack">
          <b style={{
            color: 'red'
          }}>jack</b>
        </Option>
        <Option value="lucy">lucy</Option>
        <Option value="disabled" disabled>disabled</Option>
        <Option value="yiminghe">yiminghe</Option>
      </Select>
    </div>
  </div>
);

ReactDOM.render(c1, document.getElementById('__react-content'));
