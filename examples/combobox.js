'use strict';

import React from 'react';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.css';

var c3 = (
  <div>
    <h2>combobox</h2>
    <div style={{width: 300}}>
      <Select
        renderDropdownToBody={location.href.indexOf('renderDropdownToBody') !== -1}
        style={{width:500}}
        combobox>
        <Option value="jack">
          <b style={{
            color: 'red'
          }}>jack</b>
        </Option>
        <Option value="lucy" >lucy</Option>
        <Option value="disabled" disabled>disabled</Option>
        <Option value="yiminghe">yiminghe</Option>
      </Select>
    </div>
  </div>
);

React.render(c3, document.getElementById('__react-content'));
