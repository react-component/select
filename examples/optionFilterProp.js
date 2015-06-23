'use strict';

var React = require('react');
var Select = require('rc-select');
var Option = Select.Option;
require('rc-select/assets/index.css');
var pkg = require('../package.json');

function handleChange(value) {
  console.log('selected ' + value);
}

var c1 = (
  <div>
    <h1>{pkg.name}@{pkg.version}</h1>
    <h2>Select optionFilterProp</h2>
    <div style={{width: 300}}>
      <Select value="张三" style={{width:250}}
        optionFilterProp="desc"
        onChange={handleChange}>
        <Option value="张三" desc="张三 zhang san">张三</Option>
        <Option value="李四" desc="李四 li si">李四</Option>
        <Option value="王五" desc="王五 wang wu">王五</Option>
      </Select>
    </div>
  </div>
);

React.render(c1, document.getElementById('__react-content'));
