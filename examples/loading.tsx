/* eslint-disable no-console */
import React from 'react';
import Select, { Option } from '../src';
import '../assets/index.less';

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
    for (let i = 10; i < 36; i += 1) {
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
    const { loading, children, value } = this.state;
    return (
      <div>
        <h2>loading load data</h2>

        <div style={{ width: 300 }}>
          <Select
            value={value}
            style={{ width: 500 }}
            mode="multiple"
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

export default Test;
/* eslint-enable */
