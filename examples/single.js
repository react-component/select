'use strict';

import React from 'react';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.less';

function handleChange(value) {
  console.log('selected ' + value);
}

var Test = React.createClass({
  getInitialState() {
    return {
      destroy: false
    }
  },

  handleDestroy() {
    this.setState({
      destroy: 1
    });
  },

  render() {
    if (this.state.destroy) {
      return null;
    }
    return (
      <div style={{margin: 20}}>
        <h2>Single Select</h2>
        <div style={{width: 300}}>
          <Select value="lucy"
            dropdownMenuStyle={{maxHeight: 200, overflow: 'auto'}}
            renderDropdownToBody={location.href.indexOf('renderDropdownToBody') !== -1}
            style={{width: 500}}
            onChange={handleChange}>
            <Option value="jack">
              <b style={{
                color: 'red'
              }}>jack</b>
            </Option>
            <Option value="lucy">lucy</Option>
            <Option value="disabled" disabled>disabled</Option>
            <Option value="yiminghe">yiminghe</Option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) {
            return <Option key={i}>{i}</Option>
          })}
          </Select>
        </div>

        <h2>native select</h2>
        <select value="lucy"
          style={{width: 500}}
          onChange={handleChange}>
          <option value="jack">jack</option>
          <option value="lucy">lucy</option>
          <option value="disabled" disabled>disabled</option>
          <option value="yiminghe">yiminghe</option>
        </select>

        <p>
          <button onClick={this.handleDestroy}>destroy</button>
        </p>
      </div>
    );
  }
});

React.render(<Test />, document.getElementById('__react-content'));
