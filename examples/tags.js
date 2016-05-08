/* eslint no-console: 0 */

import React from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}
const maxValueCountSelect = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 26];

const Test = React.createClass({
  getInitialState() {
    return {
      disabled: false,
      maxValueCount: 0,
      value: ['name2', 'name3'],
    };
  },
  onChange(value) {
    console.log(`selected ${value}`);
    this.setState({
      value,
    });
  },
  onMaxValueCountChange(e) {
    this.setState({
      maxValueCount: +e.target.value,
    });
  },
  toggleDisabled() {
    this.setState({
      disabled: !this.state.disabled,
    });
  },
  render() {
    return (
      <div>
        <h2>tags select（scroll the menu）</h2>

        <p>
          <label>
            maxValueCount
            <select onChange={this.onMaxValueCountChange} defaultValue={this.state.maxValueCount}>
              {
                maxValueCountSelect.map(i => <option key={i} value={i}>{i}</option>)
              }
            </select>
          </label>
        </p>
        <div>
          <Select
            placeholder="placeholder"
            tags
            dropdownMenuStyle={{ maxHeight: 200, overflow: 'auto' }}
            style={{ width: 500 }}
            disabled={this.state.disabled}
            maxTagTextLength={10}
            maxValueCount={this.state.maxValueCount}
            value={this.state.value}
            onChange={this.onChange}
          >
            {children}
          </Select>
        </div>
        <p>
          <button onClick={this.toggleDisabled}>toggle disabled</button>
        </p>
      </div>
    );
  },
});

ReactDOM.render(<Test />, document.getElementById('__react-content'));
