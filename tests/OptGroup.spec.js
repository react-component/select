'use strict';

var expect = require('expect.js');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Simulate = TestUtils.Simulate;
var Select = require('../');
var Option = Select.Option;
var OptGroup = Select.OptGroup;

describe('OptGroup',function(){
  var div;

  beforeEach(function () {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(function () {
    React.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('works',function(){
    var select=React.render(<Select value="lucy"
      showSearch={false}
      style={{width: 250}}>
      <OptGroup label="manager">
        <Option value="jack">
          <b style={{
            color: 'red'
          }}>jack</b>
        </Option>
        <Option value="lucy">lucy</Option>
      </OptGroup>
      <OptGroup label="engineer">
        <Option value="yiminghe">yiminghe</Option>
      </OptGroup>
    </Select>,div);

    Simulate.click(TestUtils.scryRenderedDOMComponentsWithClass(select, 'rc-select-selection')[0]);

    expect(TestUtils.scryRenderedDOMComponentsWithClass(select, 'rc-select-menu-item-group').length).to.be(2);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(select, 'rc-select-menu-item').length).to.be(3);
  });
});
