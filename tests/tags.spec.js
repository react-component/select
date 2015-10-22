var expect = require('expect.js');
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
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
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });


  this.timeout(400000);

  beforeEach(function () {
    div.tabIndex = 0;
    instance = ReactDOM.render(
      <Select tags>
        <Option key="1">1</Option>
        <Option key="2">2</Option>
      </Select>,
      div);
  });

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(div);
  });

  it('should allow user input as tags', function (done) {
    if (navigator.userAgent.indexOf(' Chrome') === -1) {
      done();
      return;
    }

    var node = instance.getInputDOMNode();
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
