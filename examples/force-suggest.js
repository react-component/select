'use strict';

import React from 'react';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.less';
import {fetch} from './common/tbFetchSuggest';
import ReactDOM from 'react-dom';

var Search = React.createClass({
  getInitialState() {
    return {
      loading: false,
      data: [],
      value: '',
      label: ''
    }
  },

  fetchData(value) {
    this.setState({
      loading: true
    });
    fetch(value, (data)=> {
      this.setState({
        data,
        loading: false
      });
    });
  },

  handleChange(value, label) {
    console.log('select ', value, label);
    this.setState({value, label})
  },

  render() {
    var data = this.state.data;
    var options;
    if (this.state.loading) {
      options = <Option disabled key="disabled">loading</Option>;
    } else {
      options = data.map((d) => {
        return <Option key={d.value}><i>{d.text}</i></Option>;
      });
    }
    return <div>
      <h2>force suggest</h2>

      <div>
        <Select onSearch={this.fetchData}
                value={this.state.value}
                label={this.state.label}
                optionLabelProp="children"
                style={{width:500}}
                onChange={this.handleChange}
                filterOption={false}>
          {options}
        </Select>
      </div>
    </div>;
  }
});

ReactDOM.render(<Search />, document.getElementById('__react-content'));
