var React = require('react');
var Select = require('rc-select');
var Option = Select.Option;
require('rc-menu/assets/index.css');
require('rc-select/assets/index.css');
function handleChange(value) {
  console.log('selected ' + value);
}

var c1 = (
  <div>
    <h1>Single Select</h1>
    <div style={{width: 300}}>
      <Select value="lucy" className="forTest" onChange={handleChange}>
        <Option value="jack" className="forTest">
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
