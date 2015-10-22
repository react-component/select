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
    <h2>Select optionFilterProp</h2>
    <div style={{width: 300}}>
      <Select defaultValue="张三"
        style={{width:500}}
        optionFilterProp="desc"
        onChange={handleChange}>
        <Option value="张三" desc="张三 zhang san">张三</Option>
        <Option value="李四" desc="李四 li si">李四</Option>
        <Option value="王五" desc="王五 wang wu">王五</Option>
      </Select>
    </div>
  </div>
);

ReactDOM.render(c1, document.getElementById('__react-content'));
