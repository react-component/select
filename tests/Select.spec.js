var expect = require('expect.js');
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var Simulate = TestUtils.Simulate;
var KeyCode = require('rc-util').KeyCode;
var Select = require('../');
var Option = Select.Option;
var $ = require('jquery');

describe('Select', function () {
  var instance;
  var div;

  beforeEach(function () {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('render to body works', function (done) {
    var instance = ReactDOM.render(
      <Select
        value="2">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
      div);
    instance.setState({
      open: true
    }, function () {
      expect(instance.getPopupDOMNode().parentNode.parentNode.nodeName.toLowerCase()).to.be('body');
      expect(instance.getPopupDOMNode().className).not.to.contain('hidden');
      done();
    });
  });

  it('should add css class of root dom node', function () {
    var instance = ReactDOM.render(
      <Select className="forTest" openClassName="my-open" value="2">
        <Option value="1">1</Option>
        <Option value="2" disabled>2</Option>
      </Select>, div);
    expect(ReactDOM.findDOMNode(instance).className.indexOf('forTest') !== -1).to.be(true);
  });

  it('should default select the right option', function (done) {
    var instance = ReactDOM.render(
      <Select defaultValue="2">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>, div);
    instance.setState({
      open: true
    }, function () {
      expect(instance.getPopupMenuComponent().instanceArray[0].props.selected).to.be(false);
      expect(instance.getPopupMenuComponent().instanceArray[1].props.selected).to.be(true);
      done();
    });
  });

  it('should can select multiple items', function (done) {
    var instance = ReactDOM.render(
      <Select multiple value={['1', '2']}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">2</Option>
      </Select>, div);
    instance.setState({
      open: true
    }, function () {
      expect(instance.getPopupMenuComponent().instanceArray[0].props.selected).to.be(true);
      expect(instance.getPopupMenuComponent().instanceArray[1].props.selected).to.be(true);
      expect(instance.getPopupMenuComponent().instanceArray[2].props.selected).to.be(false);
      done();
    });
  });

  it('should have clear button', function () {
    var instance = ReactDOM.render(
      <Select allowClear={true}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
      div);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(instance, 'rc-select-selection__clear').length).to.be(1);
  });

  describe('when open', function () {
    var div;

    this.timeout(400000);

    beforeEach(function (done) {
      div = document.createElement('div');
      div.tabIndex = 0;
      document.body.appendChild(div);
      instance = ReactDOM.render(
        <Select>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
        div);
      Simulate.click(ReactDOM.findDOMNode(instance.refs.selection));
      done();
    });

    afterEach(function () {
      ReactDOM.unmountComponentAtNode(div);
    });

    it('should show not found', function (done) {
      instance.getInputDOMNode().value = "4";
      Simulate.change(instance.getInputDOMNode());
      setTimeout(function () {
        expect($(instance.getPopupDOMNode()).find('.rc-select-dropdown-menu-item').length).to.be(1);
        expect($(instance.getPopupDOMNode()).find('.rc-select-dropdown-menu-item')[0].innerHTML).to.be('Not Found');
        done();
      }, 100);
    });
  });
});
