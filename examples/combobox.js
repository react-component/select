/* eslint no-console: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';

class Demo extends React.Component {
  state = {
    disabled: false,
    value: 'l',
  };

  onChange = (value) => {
    this.setState({
      value,
    });
  }

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      console.log('onEnter', this.state.value);
    }
  }

  onSelect = (v) => {
    console.log('onSelect', v);
  }

  toggleDisabled = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  }

  render() {
    return (<div>
      <h2>combobox</h2>
      <p>
        <button onClick={this.toggleDisabled}>toggle disabled</button>
      </p>
      <div style={{ width: 300 }} onKeyDown={this.onKeyDown}>
        <Select
          disabled={this.state.disabled}
          style={{ width: 500 }}
          onChange={this.onChange}
          onSelect={this.onSelect}
          defaultActiveFirstOption={false}
          notFoundContent=""
          allowClear
          placeholder="please select"
          value={this.state.value}
          combobox
        >
          <Option value="jack">
            <b style={{ color: 'red' }}>jack</b>
          </Option>
          <Option value="lucy">lucy</Option>
          <Option value="disabled" disabled>disabled</Option>
          <Option value="yiminghe">yiminghe</Option>
        </Select>
      </div>
    </div>);
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
