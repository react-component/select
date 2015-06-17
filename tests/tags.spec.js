'use strict';

var expect = require('expect.js');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Simulate = TestUtils.Simulate;
var KeyCode = require('rc-util').KeyCode;
var Select = require('../');
var Option = Select.Option;

describe('tags', function () {
  var div, instance;

  beforeEach(function () {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(function () {
    React.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });


  this.timeout(400000);

  beforeEach(function () {
    div.tabIndex = 0;
    instance = React.render(
      <Select tags>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
      div);
  });

  afterEach(function () {
    React.unmountComponentAtNode(div);
  });

  it('should allow user input as tags', function (done) {
    if (navigator.userAgent.indexOf(' Chrome') === -1) {
      done();
      return;
    }

    var node = React.findDOMNode(instance.refs.input);
    node.focus();
    node.value = 'A';
    Simulate.change(node);
    setTimeout(function () {
      Simulate.keyDown(node, {
        keyCode: KeyCode.ENTER
      });
      setTimeout(function () {
        expect(instance.state.value).to.contain("A");
        done();
      }, 100);
    }, 100);
  });
});
