/* eslint no-console: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';

class Demo extends React.Component {
  state = {
    disabled: false,
    value: '',
  };

  onChange = (value, option) => {
    console.log('onChange', value, option);
    this.setState({
      value,
    });
  };

  onKeyDown = e => {
    const { value } = this.state;
    if (e.keyCode === 13) {
      console.log('onEnter', value);
    }
  };

  onSelect = (v, option) => {
    console.log('onSelect', v, option);
  };

  toggleDisabled = () => {
    const { disabled } = this.state;
    this.setState({
      disabled: !disabled,
    });
  };

  render() {
    const { value, disabled } = this.state;
    return (
      <div>
        <h2>combobox</h2>
        <p>
          <button type="button" onClick={this.toggleDisabled}>
            toggle disabled
          </button>
        </p>
        <div style={{ width: 300 }}>
          <Select
            disabled={disabled}
            style={{ width: 500 }}
            onChange={this.onChange}
            onSelect={this.onSelect}
            onInputKeyDown={this.onKeyDown}
            notFoundContent=""
            allowClear
            placeholder="please select"
            value={value}
            combobox
            backfill
            onFocus={() => console.log('focus')}
            onBlur={() => console.log('blur')}
          >
            <Option value="jack">
              <b style={{ color: 'red' }}>jack</b>
            </Option>
            <Option value="lucy">lucy</Option>
            <Option value="disabled" disabled>
              disabled
            </Option>
            <Option value="yiminghe">yiminghe</Option>
          </Select>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
