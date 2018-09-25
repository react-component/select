/* eslint no-console: 0 */

import React from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

import { fetch } from './common/tbFetchSuggest';

class Search extends React.Component {
  state = {
    disabled: false,
    data: [],
    value: undefined,
  };

  onChange = (value) => {
    console.log('select ', value);
    this.setState({
      value,
    });
  };

  fetchData = (value) => {
    if (value) {
      fetch(value, (data) => {
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
    this.setState({
      disabled: !this.state.disabled,
    });
  };

  render() {
    const data = this.state.data;
    const options = data.map((d) => {
      return <Option key={d.value}><i>{d.text}</i></Option>;
    });
    return (<div>
      <h2>force suggest</h2>
      <p>
        <button onClick={this.toggleDisabled}>toggle disabled</button>
      </p>
      <div>
        <Select
          labelInValue
          onSearch={this.fetchData}
          disabled={this.state.disabled}
          value={this.state.value}
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
    </div>);
  }
}

ReactDOM.render(<Search />, document.getElementById('__react-content'));
