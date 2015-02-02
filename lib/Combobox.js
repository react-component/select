/** @jsx React.DOM */

/**
* Option
*/
var React = require('react');
var Select = require('./Select');

var Combobox = React.createClass({
  propTypes: {

  },
  render: function () {
    return <Select multiple __combobox={true} maximumSelectionLength="1" >{this.props.children}</Select>;
  }
});
module.exports = Combobox;