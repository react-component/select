/* eslint no-console: 0 */

import React from 'react';
import createReactClass from 'create-react-class';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

const Test = createReactClass({
  getInitialState() {
    return {
      options: [],
    };
  },
  onSelect(value) {
    console.log('onSelect', value);
  },
  onChange(value) {
    console.log('onChange', value);
    let options = [];
    if (value) {
      if (value.indexOf('@') >= 0) {
        options = <Option key={value}>{value}</Option>;
      } else {
        options = ['gmail.com', 'yahoo.com', 'outlook.com'].map((domain) => {
          const email = `${value}@${domain}`;
          return <Option key={email}>{email}</Option>;
        });
      }
    }
    this.setState({
      options,
    });
  },
  render() {
    return (<Select
      combobox
      notFoundContent={false}
      style={{ width: 200 }}
      onChange={this.onChange}
      onSelect={this.onSelect}
      placeholder="请输入账户名"
    >
      {this.state.options}
    </Select>);
  },
});

ReactDOM.render(<Test />, document.getElementById('__react-content'));
