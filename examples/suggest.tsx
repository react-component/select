/* eslint-disable no-console */
import React from 'react';
import Select, { Option } from '../src';
import '../assets/index.less';

import { fetch } from './common/tbFetchSuggest';

const Input = React.forwardRef<HTMLInputElement, any>((props, ref) => (
  <input ref={ref} {...props} />
));

class Test extends React.Component {
  state = {
    data: [],
    value: '',
  };

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      const { value } = this.state;
      console.log('onEnter', value);
      this.jump(value);
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
    const { data, value } = this.state;
    const options = data.map((d) => <Option key={d.value}>{d.text}</Option>);
    return (
      <div>
        <h2>suggest</h2>

        <div onKeyDown={this.onKeyDown}>
          <Select
            style={{ width: 500 }}
            mode="combobox"
            value={value}
            placeholder="placeholder"
            defaultActiveFirstOption={false}
            getInputElement={() => <Input className="custom-input" />}
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
      </div>
    );
  }
}

export default Test;
/* eslint-enable */
