

import React from 'react';
import ReactDOM from 'react-dom';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.less';

function onChange(value) {
  console.log(value);
}

const c3 = (
  <div>
    <h2>combobox</h2>
    <div style={{width: 300}}>
      <Select
        style={{width: 500}}
        onChange={onChange}
        allowClear
        defaultValue="l"
        combobox>
        <Option value="jack">
          <b style={{
            color: 'red',
          }}>jack</b>
        </Option>
        <Option value="lucy" >lucy</Option>
        <Option value="disabled" disabled>disabled</Option>
        <Option value="yiminghe">yiminghe</Option>
      </Select>
    </div>
  </div>
);

ReactDOM.render(c3, document.getElementById('__react-content'));
