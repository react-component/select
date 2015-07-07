'use strict';

var React = require('react');
var Select = require('rc-select');
var Option = Select.Option;
require('rc-select/assets/index.css');

var children = [];
for (var i = 10; i < 36; i++) {
  children.push(<Option value={i.toString(36) + i} key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

var style = '.rc-select-menu {max-height:200px;overflow:auto;}';

var Test = React.createClass({
  getInitialState() {
    return {
      disabled: false,
      value: ['name2', 'name3']
    };
  },
  handleChange(value) {
    console.log('selected ' + value);
    this.setState({
      value: value
    });
  },
  handleDisabled() {
    this.setState({
      disabled: !this.state.disabled
    });
  },
  render() {
    return (
      <div>
        <h2>tags select（scroll the menu）</h2>
        <div>
          <style>
      {style}
          </style>
          <Select tags
            style={{width:500}}
            disabled={this.state.disabled}
            maxTagTextLength={10}
            value={this.state.value}
            onChange={this.handleChange}>
    {children}
          </Select>
        </div>
        <p>
          <button onClick={this.handleDisabled}>toggle disabled</button>
        </p>
      </div>
    );
  }
});

React.render(<Test />, document.getElementById('__react-content'));
