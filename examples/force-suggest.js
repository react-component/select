/* eslint no-console: 0 */

import React from 'react';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.less';
import {fetch} from './common/tbFetchSuggest';
import ReactDOM from 'react-dom';

const Search = React.createClass({
  getInitialState() {
    return {
      disabled: false,
      data: [],
      value: '',
      label: '',
    };
  },

  onChange(value, label) {
    console.log('select ', value, label);
    this.setState({value, label});
  },

  fetchData(value) {
    fetch(value, (data)=> {
      this.setState({
        data,
      });
    });
  },

  toggleDisabled() {
    this.setState({
      disabled: !this.state.disabled,
    });
  },

  render() {
    const data = this.state.data;
    let options;
    options = data.map((d) => {
      return <Option key={d.value}><i>{d.text}</i></Option>;
    });
    return (<div>
      <h2>force suggest</h2>
      <p>
        <button onClick={this.toggleDisabled}>toggle disabled</button>
      </p>
      <div>
        <Select onSearch={this.fetchData}
                disabled={this.state.disabled}
                value={this.state.value}
                label={this.state.label}
                optionLabelProp="children"
                style={{width: 500}}
                onChange={this.onChange}
                filterOption={false}>
          {options}
        </Select>
      </div>
    </div>);
  },
});

ReactDOM.render(<Search />, document.getElementById('__react-content'));
