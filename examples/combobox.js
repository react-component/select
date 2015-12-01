/* eslint no-console: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.less';

const Test = React.createClass({
  getInitialState() {
    return {
      disabled: false,
    };
  },

  onChange(value) {
    console.log(value);
  },

  toggleDisabled() {
    this.setState({
      disabled: !this.state.disabled,
    });
  },

  render() {
    return (<div>
    <h2>combobox</h2>
    <p>
      <button onClick={this.toggleDisabled}>toggle disabled</button>
    </p>
    <div style={{width: 300}}>
      <Select
        disabled={this.state.disabled}
        style={{width: 500}}
        onChange={this.onChange}
        allowClear
        defaultValue="l"
        combobox>
        <Option value="jack">
          <b style={{
            color: 'red',
          }}>jack</b>
        </Option>
        <Option value="lucy" >lucy</Option>
        <Option value="disabled" disabled>disabled</Option>
        <Option value="yiminghe">yiminghe</Option>
      </Select>
    </div>
  </div>);
  },
});

ReactDOM.render(<Test />, document.getElementById('__react-content'));
