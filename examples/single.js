'use strict';

var React = require('react');
var Select = require('rc-select');
var Option = Select.Option;
require('rc-select/assets/index.css');
function handleChange(value) {
  console.log('selected ' + value);
}


var c1 = (
  <div>
    <h1>Single Select</h1>
    <div style={{width: 300}}>
      <Select value="lucy" style={{width:250}} onChange={handleChange} disabled>
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

React.render(c1, document.getElementById('__react-content'));
