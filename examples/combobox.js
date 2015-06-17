'use strict';

var React = require('react');
var Select = require('../');
var Option = Select.Option;
require('rc-select/assets/index.css');
var pkg = require('../package.json');
var style = {
  color: 'red'
};
var c3 = (
  <div>
    <h1>{pkg.name}@{pkg.version}</h1>
    <h2>combobox</h2>
    <div style={{width: 300}}>
      <Select combobox>
        <Option value="jack">
          <b style={style}>jack</b>
        </Option>
        <Option value="lucy" >lucy</Option>
        <Option value="disabled" disabled>disabled</Option>
        <Option value="yiminghe">yiminghe</Option>
      </Select>
    </div>
  </div>
);

React.render(c3, document.getElementById('__react-content'));
