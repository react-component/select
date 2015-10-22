'use strict';

import React from 'react';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

function handleChange(value) {
  console.log('selected ' + value);
}

var Test = React.createClass({
  getInitialState() {
    return {
      destroy: false,
      value: '1'
    }
  },

  onChange(e){
    let value;
    if (e.target) {
      value = e.target.value;
    } else {
      value = e;
    }
    this.setState({value});
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
        <div style={{height:150}}/>

        <h2>Single Select</h2>

        <div style={{width: 300}}>
          <Select value={this.state.value}
                  dropdownMenuStyle={{maxHeight: 200, overflow: 'auto'}}
                  style={{width: 500}}
                  onChange={this.onChange}>
            <Option value="jack">
              <b style={{
                color: 'red'
              }}>jack</b>
            </Option>
            <Option value="lucy">lucy</Option>
            <Option value="disabled" disabled>disabled</Option>
            <Option value="yiminghe">yiminghe</Option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) {
              return <Option key={i+''}>{i+''}</Option>
            })}
          </Select>
        </div>

        <h2>native select</h2>
        <select value={this.state.value}
                style={{width: 500}}
                onChange={this.onChange}>
          <option value="jack">jack</option>
          <option value="lucy">lucy</option>
          <option value="disabled" disabled>disabled</option>
          <option value="yiminghe">yiminghe</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) {
            return <option value={i+''} key={i+''}>{i}</option>
          })}
        </select>

        <p>
          <button onClick={this.handleDestroy}>destroy</button>
        </p>
      </div>
    );
  }
});

ReactDOM.render(<Test />, document.getElementById('__react-content'));
