'use strict';

import React from 'react';
import Select, {Option, OptGroup} from 'rc-select';
import 'rc-select/assets/index.less';

function handleChange(value) {
  console.log('selected ' + value);
}

var c1 = (
  <div>
    <h2>Select OptGroup</h2>
    <div style={{width: 300}}>
      <Select defaultValue="lucy"
        renderDropdownToBody={location.href.indexOf('renderDropdownToBody') !== -1}
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

React.render(c1, document.getElementById('__react-content'));
