/* eslint no-console: 0 */

import React from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

class Test extends React.Component {
  state = {
    destroy: false,
    value: 9,
    open: true,
  };

  onChange = e => {
    let value;
    if (e && e.target) {
      value = e.target.value;
    } else {
      value = e;
    }
    console.log('onChange', value);
    this.setState({
      value,
    });
  };

  onDestroy = () => {
    this.setState({
      destroy: 1,
    });
  };

  onBlur = v => {
    console.log('onBlur', v);
  };

  onFocus = () => {
    console.log('onFocus');
  };

  onDropdownVisibleChange = open => {
    this.setState({ open });
  };

  render() {
    const { open, destroy, value } = this.state;
    if (destroy) {
      return null;
    }
    return (
      <div style={{ margin: 20 }}>
        <h2>controlled Select</h2>
        <div style={{ width: 300 }}>
          <Select
            id="my-select"
            value={value}
            placeholder="placeholder"
            dropdownMenuStyle={{ maxHeight: 200 }}
            style={{ width: 500 }}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            open={open}
            optionLabelProp="children"
            optionFilterProp="text"
            onChange={this.onChange}
            onDropdownVisibleChange={this.onDropdownVisibleChange}
          >
            <Option value="01" text="jack" title="jack">
              <b
                style={{
                  color: 'red',
                }}
              >
                jack
              </b>
            </Option>
            <Option value="11" text="lucy">
              lucy
            </Option>
            <Option value="21" disabled text="disabled">
              disabled
            </Option>
            <Option value="31" text="yiminghe">
              yiminghe
            </Option>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
              return (
                <Option key={i} value={i} text={String(i)}>
                  {i}-text
                </Option>
              );
            })}
          </Select>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Test />, document.getElementById('__react-content'));
