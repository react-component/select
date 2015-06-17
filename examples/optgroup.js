'use strict';

var React = require('react');
var Select = require('rc-select');
var Option = Select.Option;
var OptGroup = Select.OptGroup;

require('rc-select/assets/index.css');
var pkg = require('../package.json');

function handleChange(value) {
  console.log('selected ' + value);
}

var c1 = (
  <div>
    <h1>{pkg.name}@{pkg.version}</h1>
    <h2>Select OptGroup</h2>
    <div style={{width: 300}}>
      <Select value="lucy"
        showSearch={false}
        style={{width: 250}} onChange={handleChange}>
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
