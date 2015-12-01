/* eslint no-console: 0 */

import React from 'react';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.less';
import {fetch} from './common/tbFetchSuggest';
import ReactDOM from 'react-dom';

const Search = React.createClass({
  getInitialState() {
    return {
      data: [],
    };
  },

  fetchData(value) {
    fetch(value, (data) => {
      this.setState({
        data,
      });
    });
  },

  handleSelect(value) {
    console.log('select ', value);
  },

  render() {
    const data = this.state.data;
    const options = data.map((d) => {
      return <Option key={d.value}>{d.text}</Option>;
    });
    return (<div>
      <h2>multiple suggest</h2>

      <div>
        <Select
          style={{width: 500}}
          tags
          notFoundContent=""
          onSearch={this.fetchData}
          onSelect={this.handleSelect}
          filterOption={false}>
          {options}
        </Select>
      </div>
    </div>);
  },
});

ReactDOM.render(<Search />, document.getElementById('__react-content'));
