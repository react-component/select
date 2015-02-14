var React = require('react');
var Select = require('../');
var Option = Select.Option;
require('./examples.css');
require('rc-menu/assets/index.css');
require('rc-select/assets/index.css');
var style = {
  color: 'red'
};
var c3 = (
  <div>
    <h1>combobox</h1>
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
