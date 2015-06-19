'use strict';

var React = require('react');
var Select = require('../');
var Option = Select.Option;
require('rc-select/assets/index.css');
var jsonp = require('jsonp');
var querystring = require('querystring');
var pkg = require('../package.json');

var Search = React.createClass({
  getInitialState() {
    return {
      data: []
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
          text: r[0]
        });
      });
      this.setState({
        data: data
      });
    });
  },

  handleChange(value) {
    console.log('select ', value);
  },

  render() {
    var data = this.state.data;
    var options = data.map((d) => {
      return <Option value={d.value} key={d.value} label={<i>{d.text}</i>}>{d.text}</Option>;
    });
    return <div>
      <h1>{pkg.name}@{pkg.version}</h1>
      <h2>force suggest</h2>
      <div>
        <Select onSearch={this.fetchData}
          optionLabelProp="label"
          style={{width: 300}}
          onChange={this.handleChange}
          filterOption={false}>
        {options}
        </Select>
      </div>
    </div>;
  }
});

React.render(<Search />, document.getElementById('__react-content'));
