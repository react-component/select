/* eslint-disable no-console */
import React from 'react';
import Select, { Option } from '../src';
import '../assets/index.less';

class Test extends React.Component {
  state = {
    options: [],
  };

  onSelect = value => {
    console.log('onSelect', value);
  };

  onChange = value => {
    console.log('onChange', value);
    let options: React.ReactNode = [];
    if (value) {
      if (value.indexOf('@') >= 0) {
        options = <Option key={value}>{value}</Option>;
      } else {
        options = ['gmail.com', 'yahoo.com', 'outlook.com'].map(domain => {
          const email = `${value}@${domain}`;
          return <Option key={email}>{email}</Option>;
        });
      }
    }
    this.setState({
      options,
    });
  };

  render() {
    const { options } = this.state;
    return (
      <Select
        mode="combobox"
        notFoundContent={false}
        style={{ width: 200 }}
        onChange={this.onChange}
        onSelect={this.onSelect}
        placeholder="请输入账户名"
      >
        {options}
      </Select>
    );
  }
}

export default Test;
/* eslint-enable */
