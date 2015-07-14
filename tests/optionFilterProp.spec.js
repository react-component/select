'use strict';

var expect = require('expect.js');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Simulate = TestUtils.Simulate;
var KeyCode = require('rc-util').KeyCode;
var Select = require('../');
var Option = Select.Option;

describe('optionFilterProp', function () {
  var div;

  beforeEach(function () {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(function () {
    React.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });
  it('optionFilterProp defaults to value', function () {
    var select = React.render(<Select notFoundContent="">
      <Option value="1">1</Option>
      <Option value="2">2</Option>
      <Option value="11">11</Option>
    </Select>, div);
    React.findDOMNode(select.refs.selection).focus();
    Simulate.click(React.findDOMNode(select.refs.selection));
    select.getInputDOMNode().value = "1";
    Simulate.change(select.getInputDOMNode());
    expect(TestUtils.scryRenderedDOMComponentsWithClass(select, 'rc-select-menu-item').length).to.be(2);
    select.getInputDOMNode().value = "2";
    Simulate.change(select.getInputDOMNode());
    expect(TestUtils.scryRenderedDOMComponentsWithClass(select, 'rc-select-menu-item').length).to.be(1);
  });

  it('can set optionFilterProp', function () {
    var select = React.render(<Select optionFilterProp="label"
      notFoundContent=""
      style={{width: 400}}>
      <Option value="1" label="一">1</Option>
      <Option value="2" label="二">2</Option>
      <Option value="11" label="十一">11</Option>
    </Select>, div);
    React.findDOMNode(select.refs.selection).focus();
    Simulate.click(React.findDOMNode(select.refs.selection));
    select.getInputDOMNode().value = "1";
    Simulate.change(select.getInputDOMNode());
    expect(TestUtils.scryRenderedDOMComponentsWithClass(select, 'rc-select-menu-item').length).to.be(0);
    select.getInputDOMNode().value = "2";
    Simulate.change(select.getInputDOMNode());
    expect(TestUtils.scryRenderedDOMComponentsWithClass(select, 'rc-select-menu-item').length).to.be(0);
    select.getInputDOMNode().value = "一";
    Simulate.change(select.getInputDOMNode());
    expect(TestUtils.scryRenderedDOMComponentsWithClass(select, 'rc-select-menu-item').length).to.be(2);
    select.getInputDOMNode().value = "二";
    Simulate.change(select.getInputDOMNode());
    expect(TestUtils.scryRenderedDOMComponentsWithClass(select, 'rc-select-menu-item').length).to.be(1);
  });
});
