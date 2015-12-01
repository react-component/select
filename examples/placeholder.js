/* eslint no-console: 0 */

import React from 'react';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

function onChange(value) {
  console.log('selected ' + value);
}

const c1 = (
  <div>
    <h2>Select placeholder</h2>
    <div style={{width: 300}}>
      <Select
        placeholder={<i>请下拉选择</i>}
        searchPlaceholder="输入过滤"
        style={{width: 500}}
        onChange={onChange}>
        <Option value="jack">
          <b style={{
            color: 'red',
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
