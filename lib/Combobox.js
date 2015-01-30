/** @jsx React.DOM */

/**
* Option
*/
var React = require('react');

var Select = require('./Select');
var Menu = require('rc-menu');
var SubMenu = Menu.SubMenu;
var MenuItem = Menu.Item;

var Combobox = React.createClass({
  propTypes: {

  },
  render: function () {
    return <Select multiple __combobox>{this.props.children}</Select>
  }
});
module.exports = Combobox;