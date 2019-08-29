/* eslint-disable no-console */
import React from 'react';
import Select, { Option } from '../src';
import '../assets/index.less';

interface ControlledState {
  destroy: boolean;
  value: string | number;
  open: boolean;
}

class Controlled extends React.Component<{}, ControlledState> {
  state = {
    destroy: false,
    value: 9,
    open: true,
  };

  onChange = e => {
    let value;
    if (e && e.target) {
      ({ value } = e.target);
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
      destroy: true,
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
            listHeight={200}
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
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <Option key={i} value={i} text={String(i)}>
                {i}-text
              </Option>
            ))}
          </Select>
        </div>
      </div>
    );
  }
}

export default Controlled;
/* eslint-enable */
