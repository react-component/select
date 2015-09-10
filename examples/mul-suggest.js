'use strict';

import React from 'react';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.less';
import jsonp from 'jsonp';
import querystring from 'querystring';

var Search = React.createClass({
  getInitialState() {
    return {
      data: [],
      value: [],
      label: [],
    }
  },

  fetchData(value) {
    jsonp('http://suggest.taobao.com/sug?' + querystring.encode({
        code: 'utf-8',
        q: value
      }), (err, d) => {
      var result = d.result;
      var data = [];
      result.forEach((r)=> {
        data.push({
          value: r[0],
          text: <b>{r[0]}</b>
        });
      });
      this.setState({
        data: data
      });
    });
  },

  onChange(value, label) {
    console.log('onChange ', value, label);
    this.setState({
      value,
      label
    });
  },

  render() {
    var data = this.state.data;
    var options = data.map((d) => {
      return <Option key={d.value}><i>{d.text}</i></Option>;
    });
    return <div>
      <h2>multiple suggest</h2>

      <div>
        <Select
          value={this.state.value}
          label={this.state.label}
          style={{width: 500}}
          animation="slide-up"
          searchPlaceholder="搜索下"
          optionLabelProp="children"
          multiple
          notFoundContent=""
          onSearch={this.fetchData}
          onChange={this.onChange}
          filterOption={false}>
          {options}
        </Select>
      </div>
    </div>;
  }
});

React.render(<Search />, document.getElementById('__react-content'));
