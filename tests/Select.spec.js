/** @jsx React.DOM */

var expect = require('expect.js');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Simulate = TestUtils.Simulate;

var KeyCode = require('../lib/utils/util').KeyCode;
var Select = require('../');
var Option = Select.Option;
var Combobox = Select.Combobox;

describe('Select', function () {
  var instance;

  it('should add css class of root dom node', function () {
    var instance = TestUtils.renderIntoDocument(
      <Select className="forTest" openClassName="my-open" value="2">
        <Option value="1">1</Option>
        <Option value="2" disabled>2</Option>
      </Select>
    );
    expect(instance.refs.container.getDOMNode().classList.contains('forTest')).to.be(true);
  });

  it('should default select the right option', function () {
    var instance = TestUtils.renderIntoDocument(
      <Select value="2">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );
    expect(instance.refs.menu.refs['1'].props.selected).to.be(false);
    expect(instance.refs.menu.refs['2'].props.selected).to.be(true);
  });

  it('should can select multiple items', function () {
    var instance = TestUtils.renderIntoDocument(
      <Select multiple value={['1', '2']}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">2</Option>
      </Select>
    );
    expect(instance.refs.menu.refs['1'].props.selected).to.be(true);
    expect(instance.refs.menu.refs['2'].props.selected).to.be(true);
    expect(instance.refs.menu.refs['3'].props.selected).to.be(false);
  });

  it('should have clear button', function () {
    var instance = TestUtils.renderIntoDocument(
      <Select allowClear>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>
    );
    expect(instance.refs.selection.getDOMNode().children[0].children[1].className.indexOf('-selection__clear') !== '-1').to.be(true);
  });

  it('should select less than two options', function () {
    var instance = TestUtils.renderIntoDocument(
      <Select multiple value={['1', '2', '3']} maximumSelectionLength="2">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">3</Option>
      </Select>
    );
    expect(instance.refs.menu.refs['1'].props.selected).to.be(true);
    expect(instance.refs.menu.refs['2'].props.selected).to.be(true);
    expect(instance.refs.menu.refs['3'].props.selected).to.be(false);
  });

  it('should be combobox', function () {
    var instance = TestUtils.renderIntoDocument(
      <Combobox>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Combobox>
    );
    expect(instance.refs.select.refs.selection.getDOMNode().getAttribute('tabindex') === '-1').to.be(true);
  });

  it('should be empty', function () {
    var instance = TestUtils.renderIntoDocument(
      <Combobox></Combobox>
    );
    expect(instance.refs.select.props.children).to.be.an('undefined');
  });

  describe('when open', function () {
    beforeEach(function () {
      instance = TestUtils.renderIntoDocument(
        <Select allowClear>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
      );
      instance.setOpenState(true);
    });

    it('should close on click', function () {
      var evt = document.createEvent('HTMLEvents');
      evt.initEvent('click', true, true);
      document.documentElement.dispatchEvent(evt);

      expect(instance.getDOMNode().className.match(/\bselect-open\b/)).to.be.ok;
    });
  });

});
