/* eslint no-console: 0 */

import React from 'react';
import createReactClass from 'create-react-class';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(
    <Option key={i.toString(36) + i} disabled={i === 10} title={`中文${i}`}>
      中文{i}
    </Option>
  );
}

function onSelect() {
  console.log(arguments);
}

function onDeselect() {
  console.log(arguments);
}

const Test = createReactClass({
  getInitialState() {
    return {
      useAnim: 0,
      value: ['a10'],
    };
  },
  onChange(value) {
    console.log('onChange', value);
    this.setState({
      value,
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
            <input checked={this.state.useAnim} type="checkbox" onChange={this.useAnim} />
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
            allowClear
            optionFilterProp="children"
            optionLabelProp="children"
            onSelect={onSelect}
            onDeselect={onDeselect}
            placeholder="please select"
            onChange={this.onChange}
            onFocus={() => console.log('focus')}
            tokenSeparators={[' ', ',']}
          >
            {children}
          </Select>
        </div>
      </div>
    );
  },
});

ReactDOM.render(<Test />, document.getElementById('__react-content'));
