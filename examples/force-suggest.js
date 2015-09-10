'use strict';

import React from 'react';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.less';
import jsonp from 'jsonp';
import querystring from 'querystring';

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
    this.bufferFetch(value);
  },

  bufferFetch(value){
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.currentValue = value;
    this.timeout = setTimeout(()=> {
      jsonp('http://suggest.taobao.com/sug?' + querystring.encode({
          code: 'utf-8',
          q: value
        }), (err, d) => {
        if (this.currentValue === value) {
          var result = d.result;
          var data = [];
          result.forEach((r)=> {
            data.push({
              value: r[0],
              text: r[0]
            });
          });
          this.setState({
            data: data,
            loading: false
          });
        }
      });
    }, 300);
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

React.render(<Search />, document.getElementById('__react-content'));
