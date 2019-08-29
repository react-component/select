/* eslint-disable no-console */
import React from 'react';
import Select, { Option } from '../src';
import '../assets/index.less';

import { fetch } from './common/tbFetchSuggest';

class Test extends React.Component {
  state = {
    disabled: false,
    data: [],
    value: undefined,
  };

  onChange = value => {
    console.log('select ', value);
    this.setState({
      value,
    });
  };

  fetchData = value => {
    if (value) {
      fetch(value, data => {
        this.setState({
          data,
        });
      });
    } else {
      this.setState({
        data: [],
      });
    }
  };

  toggleDisabled = () => {
    const { disabled } = this.state;
    this.setState({
      disabled: !disabled,
    });
  };

  render() {
    const { data, value, disabled } = this.state;
    const options = data.map(d => (
      <Option key={d.value}>
        <i>{d.text}</i>
      </Option>
    ));
    return (
      <div>
        <h2>force suggest</h2>
        <p>
          <button type="button" onClick={this.toggleDisabled}>
            toggle disabled
          </button>
        </p>
        <div>
          <Select
            labelInValue
            showSearch
            onSearch={this.fetchData}
            disabled={disabled}
            value={value}
            optionLabelProp="children"
            placeholder="placeholder"
            defaultActiveFirstOption
            style={{ width: 500 }}
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
