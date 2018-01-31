/* eslint no-console: 0 */

import React from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i} test={i}>{i.toString(36) + i}</Option>);
}

class Test extends React.Component {
  state = {
    disabled: false,
    value: ['name2', 'name3'],
  };

  onChange = (value, option) => {
    console.log(`changed ${value}`, option);
    this.setState({
      value,
    });
  };

  onSelect = (value, option) => {
    console.log(`selected ${value}`, option.props);
  };

  onDeselect = (value, option) => {
    console.log(`deselected ${value}`, option);
  };

  toggleDisabled = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  };

  toggleMaxTagCount = (count) => {
    this.setState({
      maxTagCount: count,
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
            dropdownMenuStyle={{ maxHeight: 200 }}
            style={{ width: 500 }}
            disabled={this.state.disabled}
            maxTagCount={this.state.maxTagCount}
            maxTagTextLength={10}
            value={this.state.value}
            onChange={this.onChange}
            onSelect={this.onSelect}
            onDeselect={this.onDeselect}
            tokenSeparators={[' ', ',']}
          >
            {children}
          </Select>
        </div>
        <p>
          <button onClick={this.toggleDisabled}>toggle disabled</button>
          <button onClick={() => this.toggleMaxTagCount(0)}>toggle maxTagCount (0)</button>
          <button onClick={() => this.toggleMaxTagCount(1)}>toggle maxTagCount (1)</button>
        </p>
      </div>
    );
  }
}

ReactDOM.render(<Test />, document.getElementById('__react-content'));
