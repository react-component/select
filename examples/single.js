/* eslint no-console: 0 */

import React from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

class Test extends React.Component {
  state = {
    destroy: false,
    value: String(9),
  };

  onChange = (e) => {
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

  onBlur = (v) => {
    console.log('onBlur', v);
  };

  onFocus = () => {
    console.log('onFocus');
  };

  render() {
    if (this.state.destroy) {
      return null;
    }
    return (
      <div style={{ margin: 20 }}>
        <div style={{ height: 150 }}/>

        <h2>Single Select</h2>

        <div style={{ width: 300 }}>
          <Select
            value={this.state.value}
            placeholder="placeholder"
            dropdownMenuStyle={{ maxHeight: 200 }}
            style={{ width: 500 }}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            allowClear
            optionLabelProp="children"
            optionFilterProp="text"
            onChange={this.onChange}
            firstActiveValue="2"
            backfill
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
            <Option value="11" text="lucy">lucy</Option>
            <Option value="21" disabled text="disabled">disabled</Option>
            <Option value="31" text="yiminghe">yiminghe</Option>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
              return <Option key={i} text={String(i)}>{i}</Option>;
            })}
          </Select>
        </div>

        <h2>native select</h2>
        <select
          value={this.state.value}
          style={{ width: 500 }}
          onChange={this.onChange}
        >
          <option value="01">jack</option>
          <option value="11">lucy</option>
          <option value="21" disabled>disabled</option>
          <option value="31">yiminghe</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
            return <option value={i} key={i}>{i}</option>;
          })}
        </select>

        <p>
          <button onClick={this.onDestroy}>destroy</button>
        </p>
      </div>
    );
  }
}

ReactDOM.render(<Test />, document.getElementById('__react-content'));
