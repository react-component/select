/* eslint no-console: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';

const Test = React.createClass({
  getInitialState() {
    return {
      disabled: false,
      value: 'l',
    };
  },

  onChange(value) {
    this.setState({
      value,
    });
  },

  onKeyDown(e) {
    if (e.keyCode === 13) {
      console.log('onEnter', this.state.value);
    }
  },

  onSelect(v) {
    console.log('onSelect', v);
  },

  toggleDisabled() {
    this.setState({
      disabled: !this.state.disabled,
    });
  },

  render() {
    return (<div>
      <h2> dumbOnComposition </h2>
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
          dumbOnComposition
        >
          <Option value="测试">测试</Option>
          <Option value="ceshi">ceshi</Option>
          <Option value="中国" disabled>中国</Option>
          <Option value="Ant Design 设计语言">Ant Design 设计语言</Option>
        </Select>
      </div>
    </div>);
  },
});

ReactDOM.render(<Test />, document.getElementById('__react-content'));
