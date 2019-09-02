/* eslint-disable no-console */
import React from 'react';
import Select, { Option } from '../src';
import '../assets/index.less';

import { fetch } from './common/tbFetchSuggest';

class Test extends React.Component {
  state = {
    data: [],
    value: [],
  };

  onChange = value => {
    console.log('onChange ', value);
    this.setState({
      value,
    });
  };

  onSelect = value => {
    console.log('select ', value);
  };

  fetchData = value => {
    fetch(value, data => {
      this.setState({
        data,
      });
    });
  };

  render() {
    const { value, data } = this.state;
    const options = data.map(d => (
      <Option key={d.value}>
        <i>{d.text}</i>
      </Option>
    ));
    return (
      <div>
        <h2>multiple suggest</h2>

        <div>
          <Select
            style={{ width: 500 }}
            labelInValue
            optionLabelProp="children"
            value={value}
            onChange={this.onChange}
            mode="tags"
            placeholder="placeholder"
            notFoundContent=""
            onSearch={this.fetchData}
            onSelect={this.onSelect}
            filterOption={false}
          >
            {options}
          </Select>
        </div>
      </div>
    );
  }
}

export default Test;
/* eslint-enable */
