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
    <div style={{height:150}}/>
    <h2>Single Select</h2>

    <div style={{width: 300}}>
      <Select defaultValue="lucy"
              style={{width:500}}
              animation="slide-up"
              showSearch={false}
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
