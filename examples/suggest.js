/* eslint no-console: 0 */

import React from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

import { fetch } from './common/tbFetchSuggest';

const Input = (props) => <input {...props} />;

class Search extends React.Component {
  state = {
    data: [],
    value: '',
  };

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      console.log('onEnter', this.state.value);
      this.jump(this.state.value);
    }
  };

  onSelect = (value) => {
    console.log('select ', value);
    this.jump(value);
  };

  jump = (v) => {
    console.log('jump ', v);
    // location.href = 'https://s.taobao.com/search?q=' + encodeURIComponent(v);
  };

  fetchData = (value) => {
    this.setState({
      value,
    });
    fetch(value, (data) => {
      this.setState({
        data,
      });
    });
  };

  render() {
    const data = this.state.data;
    const options = data.map((d) => {
      return <Option key={d.value}>{d.text}</Option>;
    });
    return (<div>
      <h2>suggest</h2>

      <div onKeyDown={this.onKeyDown}>
        <Select
          style={{ width: 500 }}
          combobox
          value={this.state.value}
          placeholder="placeholder"
          defaultActiveFirstOption={false}
          getInputElement={() => <Input />}
          showArrow={false}
          notFoundContent=""
          onChange={this.fetchData}
          onSelect={this.onSelect}
          filterOption={false}
          onFocus={() => console.log('focus')}
          onBlur={() => console.log('blur')}
        >
          {options}
        </Select>
      </div>
    </div>);
  }
}

ReactDOM.render(<Search />, document.getElementById('__react-content'));
