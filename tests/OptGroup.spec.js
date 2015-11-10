var expect = require('expect.js');
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var Simulate = TestUtils.Simulate;
var Select = require('../');
var Option = Select.Option;
var ReactDOM = require('react-dom');
var OptGroup = Select.OptGroup;
var $ = require('jquery');

describe('OptGroup', function () {
  var div;

  beforeEach(function () {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(function (done) {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
    done();
  });

  it('works', function (done) {
    var select = ReactDOM.render(<Select value="lucy"
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
    </Select>, div);

    Simulate.click(TestUtils.scryRenderedDOMComponentsWithClass(select, 'rc-select-selection')[0]);

    expect($(select.getPopupDOMNode()).find('.rc-select-dropdown-menu-item-group').length).to.be(2);
    expect($(select.getPopupDOMNode()).find('.rc-select-dropdown-menu-item').length).to.be(3);

    done();
  });
});
