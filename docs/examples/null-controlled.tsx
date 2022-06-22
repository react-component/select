/* eslint-disable no-console */
import Select, { Option } from 'rc-select';
import React from 'react';
import '../../assets/index.less';

interface NullControlledState {
  destroy: boolean;
  value: string | number;
}

class Controlled extends React.Component<unknown, NullControlledState> {
  state = {
    destroy: false,
    value: null,
  };

  onChange = (e) => {
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

  render() {
    const { destroy, value } = this.state;
    if (destroy) {
      return null;
    }
    return (
      <div style={{ margin: 20 }}>
        <h2>controlled Select: value === null</h2>
        <div style={{ width: 300 }}>
          <Select
            id="my-select"
            value={value}
            placeholder="placeholder"
            listHeight={200}
            style={{ width: 500 }}
            onChange={this.onChange}
            allowClear
          >
            <Option value={null}>null</Option>
            <Option value="correct">correct</Option>
          </Select>
        </div>
      </div>
    );
  }
}

export default Controlled;
/* eslint-enable */
