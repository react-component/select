'use strict';

var expect = require('expect.js');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Simulate = TestUtils.Simulate;
var KeyCode = require('rc-util').KeyCode;
var Select = require('../');
var Option = Select.Option;

describe('Select', function () {
  var instance;
  var div;

  beforeEach(function () {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(function () {
    React.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('should add css class of root dom node', function () {
    var instance = TestUtils.renderIntoDocument(
      <Select className="forTest" openClassName="my-open" value="2">
        <Option value="1">1</Option>
        <Option value="2" disabled>2</Option>
      </Select>
    );
    expect(React.findDOMNode(instance).className.indexOf('forTest') !== -1).to.be(true);
  });

  it('should default select the right option', function (done) {
    var instance = TestUtils.renderIntoDocument(
      <Select value="2">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );
    instance.setState({
      open: true
    }, function () {
      expect(instance.refs.menu.instanceArray[0].props.selected).to.be(false);
      expect(instance.refs.menu.instanceArray[1].props.selected).to.be(true);
      done();
    });
  });

  it('should can select multiple items', function (done) {
    var instance = TestUtils.renderIntoDocument(
      <Select multiple value={['1', '2']}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">2</Option>
      </Select>
    );
    instance.setState({
      open: true
    }, function () {
      expect(instance.refs.menu.instanceArray[0].props.selected).to.be(true);
      expect(instance.refs.menu.instanceArray[1].props.selected).to.be(true);
      expect(instance.refs.menu.instanceArray[2].props.selected).to.be(false);
      done();
    });
  });

  it('should have clear button', function () {
    var instance = React.render(
      <Select allowClear={true}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
      div);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(instance, 'rc-select-selection__clear').length).to.be(1);
  });

  it('should be combobox', function () {
    var instance = TestUtils.renderIntoDocument(
      <Select combobox>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );
    expect(!!React.findDOMNode(instance.refs.selection).getAttribute('tabindex')).to.be(false);
  });


  describe('when open', function () {
    var div;

    this.timeout(400000);

    beforeEach(function (done) {
      div = document.createElement('div');
      div.tabIndex = 0;
      document.body.appendChild(div);
      instance = React.render(
        <Select>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>,
        div);
      React.findDOMNode(instance.refs.selection).focus();
      Simulate.click(React.findDOMNode(instance.refs.selection));
      React.findDOMNode(instance.refs.input).focus();
      setTimeout(function () {
        instance.setState({
          open: true
        }, function () {
          done();
        });
      }, 100);
    });

    afterEach(function () {
      React.unmountComponentAtNode(div);
    });

    it('should close on blur', function (done) {
      if (navigator.userAgent.indexOf(' Chrome') === -1) {
        done();
        return;
      }
      expect(React.findDOMNode(instance).className.match(/\brc-select-open\b/)).to.be.ok();
      div.focus();
      setTimeout(function () {
        expect(React.findDOMNode(instance).className.match(/\brc-select-open\b/)).not.to.be.ok();
        done();
      }, 100);
    });

  });
});
