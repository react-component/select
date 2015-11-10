var expect = require('expect.js');
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var Simulate = TestUtils.Simulate;
var Select = require('../');
var Option = Select.Option;
var OptGroup = Select.OptGroup;
var $ = require('jquery');

describe('Combobox', function () {
  var div;

  beforeEach(function () {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('should be combobox', function () {
    var instance = ReactDOM.render(
      <Select combobox>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>, div
    );
    expect(!!ReactDOM.findDOMNode(instance.refs.selection).getAttribute('tabindex')).to.be(false);
  });

  it('support defaultValue', function () {
    var instance = ReactDOM.render(
      <Select combobox defaultValue="1">
        <Option value="22222">22222</Option>
        <Option value="11111">11111</Option>
      </Select>, div
    );
    var input = ReactDOM.findDOMNode(TestUtils.scryRenderedDOMComponentsWithClass(instance, 'rc-select-search__field')[0]);
    expect(input.value).to.be('1');
    Simulate.click(input);
    var activeItem =$(instance.getPopupDOMNode()).find('.rc-select-dropdown-menu-item-active')[0];
    expect(activeItem.innerHTML).to.be('11111');
    Simulate.click(activeItem);
    expect(input.value).to.be('11111');
  });
});
