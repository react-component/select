/* eslint no-console: 0 */

import React from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

import { fetch } from './common/tbFetchSuggest';

class Search extends React.Component {
  state = {
    data: [],
    value: [],
  };

  onChange = (value) => {
    console.log('onChange ', value);
    this.setState({
      value,
    });
  };

  fetchData = (value) => {
    fetch(value, (data) => {
      this.setState({
        data,
      });
    });
  };

  render() {
    const data = this.state.data;
    const options = data.map((d) => {
      return <Option key={d.value}><i>{d.text}</i></Option>;
    });
    return (<div>
      <h2>multiple suggest</h2>

      <div>
        <Select
          value={this.state.value}
          labelInValue
          style={{ width: 500 }}
          animation="slide-up"
          placeholder="搜索下"
          optionLabelProp="children"
          multiple
          notFoundContent=""
          onSearch={this.fetchData}
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
