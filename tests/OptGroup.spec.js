import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, { Simulate } from 'react-addons-test-utils';
import Select, { Option, OptGroup } from 'rc-select';
import $ from 'jquery';

describe('OptGroup', () => {
  let div = null;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach((done) => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
    done();
  });

  it('works', (done) => {
    const select = ReactDOM.render(
      <Select
        value="lucy"
        showSearch={false}
        style={{ width: 250 }}
      >
        <OptGroup label="manager">
          <Option value="jack">
            <b
              style={{
                color: 'red',
              }}
            >
              jack
            </b>
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
