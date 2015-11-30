const expect = require('expect.js');
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const Simulate = TestUtils.Simulate;
const Select = require('../');
const Option = Select.Option;
const $ = require('jquery');

describe('optionFilterProp', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });
  it('optionFilterProp defaults to value', () => {
    const select = ReactDOM.render(<Select notFoundContent="">
      <Option value="1">1</Option>
      <Option value="2">2</Option>
      <Option value="11">11</Option>
    </Select>, div);
    ReactDOM.findDOMNode(select.refs.selection).focus();
    Simulate.click(ReactDOM.findDOMNode(select.refs.selection));
    select.getInputDOMNode().value = 1;
    Simulate.change(select.getInputDOMNode());
    expect($(select.getPopupDOMNode()).find('.rc-select-dropdown-menu-item').length).to.be(2);
    select.getInputDOMNode().value = 2;
    Simulate.change(select.getInputDOMNode());
    expect($(select.getPopupDOMNode()).find('.rc-select-dropdown-menu-item').length).to.be(1);
  });

  it('can set optionFilterProp', () => {
    const select = ReactDOM.render(<Select optionFilterProp="label"
      notFoundContent=""
      style={{width: 400}}>
      <Option value="1" label="一">1</Option>
      <Option value="2" label="二">2</Option>
      <Option value="11" label="十一">11</Option>
    </Select>, div);
    ReactDOM.findDOMNode(select.refs.selection).focus();
    Simulate.click(ReactDOM.findDOMNode(select.refs.selection));
    select.getInputDOMNode().value = 1;
    Simulate.change(select.getInputDOMNode());
    expect($(select.getPopupDOMNode()).find('.rc-select-dropdown-menu-item').length).to.be(0);
    select.getInputDOMNode().value = 2;
    Simulate.change(select.getInputDOMNode());
    expect($(select.getPopupDOMNode()).find('.rc-select-dropdown-menu-item').length).to.be(0);
    select.getInputDOMNode().value = '一';
    Simulate.change(select.getInputDOMNode());
    expect($(select.getPopupDOMNode()).find('.rc-select-dropdown-menu-item').length).to.be(2);
    select.getInputDOMNode().value = '二';
    Simulate.change(select.getInputDOMNode());
    expect($(select.getPopupDOMNode()).find('.rc-select-dropdown-menu-item').length).to.be(1);
  });
});
