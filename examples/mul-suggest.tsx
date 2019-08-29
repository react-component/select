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

  fetchData = value => {
    fetch(value, data => {
      this.setState({
        data,
      });
    });
  };

  render() {
    const { data, value } = this.state;
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
            value={value}
            labelInValue
            style={{ width: 500 }}
            animation="slide-up"
            placeholder="搜索下"
            optionLabelProp="children"
            mode="multiple"
            showSearch
            notFoundContent=""
            onSearch={this.fetchData}
            onChange={this.onChange}
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
