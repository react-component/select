/* eslint no-console: 0 */

import React from 'react';
import Select, { Option } from '../src';
import '../assets/index.less';

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(
    <Option key={i.toString(36) + i} test={i}>
      {i.toString(36) + i}
    </Option>,
  );
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
    const { disabled } = this.state;
    this.setState({
      disabled: !disabled,
    });
  };

  toggleMaxTagCount = count => {
    this.setState({
      maxTagCount: count,
    });
  };

  render() {
    const { value, maxTagCount, disabled } = this.state;
    return (
      <div>
        <h2>tags select（scroll the menu）</h2>

        <div>
          <Select
            placeholder="placeholder"
            tags
            dropdownMenuStyle={{ maxHeight: 200 }}
            style={{ width: 500 }}
            disabled={disabled}
            maxTagCount={maxTagCount}
            maxTagTextLength={10}
            value={value}
            onChange={this.onChange}
            onSelect={this.onSelect}
            onDeselect={this.onDeselect}
            tokenSeparators={[' ', ',']}
            onFocus={() => console.log('focus')}
            onBlur={() => console.log('blur')}
          >
            {children}
          </Select>
        </div>
        <p>
          <button type="button" onClick={this.toggleDisabled}>
            toggle disabled
          </button>
          <button type="button" onClick={() => this.toggleMaxTagCount(0)}>
            toggle maxTagCount (0)
          </button>
          <button type="button" onClick={() => this.toggleMaxTagCount(1)}>
            toggle maxTagCount (1)
          </button>
        </p>
      </div>
    );
  }
}

export default Test;
