/* eslint no-console: 0 */

import React from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

class Test extends React.Component {
  state = {
    loading: true,
    value: ['a10'],
    children: [],
  };

  componentDidMount() {
    setTimeout(() => {
      this.loadData();
    }, 2000);
  }

  onChange = (value, options) => {
    console.log('onChange', value, options);
    this.setState({
      value,
    });
  };

  onSelect = (...args) => {
    console.log(args);
  };

  loadData = () => {
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(
        <Option key={i.toString(36) + i} disabled={i === 10} title={`中文${i}`}>
          中文{i}
        </Option>,
      );
    }
    this.setState({
      loading: false,
      children,
    });
  };

  render() {
    const dropdownMenuStyle = {
      maxHeight: 200,
    };
    const { loading, children, value } = this.state;
    return (
      <div>
        <h2>loading load data</h2>

        <div style={{ width: 300 }}>
          <Select
            value={value}
            dropdownMenuStyle={dropdownMenuStyle}
            style={{ width: 500 }}
            multiple
            loading={loading}
            optionFilterProp="children"
            optionLabelProp="children"
            onSelect={this.onSelect}
            placeholder="please select"
            onChange={this.onChange}
            onFocus={() => console.log('focus')}
            onBlur={v => console.log('blur', v)}
            tokenSeparators={[' ', ',']}
          >
            {children}
          </Select>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Test />, document.getElementById('__react-content'));
