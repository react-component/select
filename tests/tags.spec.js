const expect = require('expect.js');
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const Simulate = TestUtils.Simulate;
const KeyCode = require('rc-util').KeyCode;
const Select = require('../');
const Option = Select.Option;

describe('tags', function test() {
  let div;
  let instance;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });


  this.timeout(400000);

  beforeEach(() => {
    div.tabIndex = 0;
    instance = ReactDOM.render(
      <Select tags>
        <Option key="1">1</Option>
        <Option key="2">2</Option>
      </Select>,
      div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
  });

  it('should allow user input as tags', (done) => {
    if (navigator.userAgent.indexOf(' Chrome') === -1) {
      done();
      return;
    }

    const node = instance.getInputDOMNode();
    node.focus();
    node.value = 'A';
    Simulate.change(node);
    setTimeout(() => {
      Simulate.keyDown(node, {
        keyCode: KeyCode.ENTER,
      });
      setTimeout(() => {
        expect(instance.state.value).to.contain('A');
        done();
      }, 100);
    }, 100);
  });
});
