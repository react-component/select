'use strict';

var React = require('react');
var Select = require('rc-select');
var Option = Select.Option;
require('rc-select/assets/index.css');

function handleChange(value) {
  console.log('selected ' + value);
}

var c1 = (
  <div style={{margin:20}}>
    <h2>Single Select</h2>
    <div style={{width: 300}}>
      <Select value="lucy"
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

    <h2>native select</h2>
      <select value="lucy"
        style={{width:500}}
        onChange={handleChange}>
        <option value="jack">jack</option>
        <option value="lucy">lucy</option>
        <option value="disabled" disabled>disabled</option>
        <option value="yiminghe">yiminghe</option>
      </select>
  </div>
);

React.render(c1, document.getElementById('__react-content'));
