/* eslint no-console: 0 */

import React from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>中文{i}</Option>);
}

const maxValueCountSelect = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 26];

function onSelect() {
  console.log(arguments);
}

function onDeselect() {
  console.log(arguments);
}

const Test = React.createClass({
  getInitialState() {
    return {
      useAnim: 0,
      maxValueCount: 0,
      value: [],
    };
  },
  onChange(value) {
    console.log('onChange', value);
    this.setState({
      value,
    });
  },
  onMaxValueCountChange(e) {
    this.setState({
      maxValueCount: +e.target.value,
    });
  },
  useAnim(e) {
    this.setState({
      useAnim: e.target.checked,
    });
  },
  render() {
    const dropdownMenuStyle = {
      maxHeight: 200,
      overflow: 'auto',
    };
    return (
      <div>
        <h2>multiple select（scroll the menu）</h2>

        <p>
          <label>
            anim
            <input checked={this.state.useAnim} type="checkbox" onChange={this.useAnim}/>
          </label>
          <label style={{ marginLeft: '2em' }}>
            maxValueCount
            <select onChange={this.onMaxValueCountChange} defaultValue={this.state.maxValueCount}>
              {
                maxValueCountSelect.map(i => <option key={i} value={i}>{i}</option>)
              }
            </select>
          </label>
        </p>

        <div style={{ width: 300 }}>
          <Select
            value={this.state.value}
            animation={this.state.useAnim ? 'slide-up' : null}
            choiceTransitionName="rc-select-selection__choice-zoom"
            dropdownMenuStyle={dropdownMenuStyle}
            style={{ width: 500 }}
            multiple
            maxValueCount={this.state.maxValueCount}
            optionFilterProp="children"
            optionLabelProp="children"
            onSelect={onSelect}
            onDeselect={onDeselect}
            placeholder="please select"
            onChange={this.onChange}
          >
            {children}
          </Select>
        </div>
      </div>
    );
  },
});

ReactDOM.render(<Test />, document.getElementById('__react-content'));
