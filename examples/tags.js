/* eslint no-console: 0 */

import React from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

class Test extends React.Component {
  state = {
    disabled: false,
    value: ['name2', 'name3'],
  };

  onChange = (value) => {
    console.log(`selected ${value}`);
    this.setState({
      value,
    });
  };

  toggleDisabled = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  };

  toggleMaxTagCount = () => {
    this.setState({
      maxTagCount: this.state.maxTagCount ? null : 1,
    });
  };

  render() {
    return (
      <div>
        <h2>tags select（scroll the menu）</h2>

        <div>
          <Select
            placeholder="placeholder"
            tags
            dropdownMenuStyle={{ maxHeight: 200, overflow: 'auto' }}
            style={{ width: 500 }}
            disabled={this.state.disabled}
            maxTagCount={this.state.maxTagCount}
            maxTagTextLength={10}
            value={this.state.value}
            onChange={this.onChange}
            tokenSeparators={[' ', ',']}
          >
            {children}
          </Select>
        </div>
        <p>
          <button onClick={this.toggleDisabled}>toggle disabled</button>
          <button onClick={this.toggleMaxTagCount}>toggle maxTagCount (1)</button>
        </p>
      </div>
    );
  }
}

ReactDOM.render(<Test />, document.getElementById('__react-content'));
