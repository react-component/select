/* eslint no-console: 0 */
import React from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

const children = [];
for (let i = 10; i < 36; i++) {
  // 11 => readonly selected item
  children.push(<Option disabled={i === 11} key={i.toString(36) + i}>中文{i}</Option>);
}

class Test extends React.Component {
  state = {
    value: ['b11'],
  };

  onChange = (value) => {
    console.log('onChange', value);
    this.setState({ value });
  };

  render() {
    const dropdownMenuStyle = {
      maxHeight: 200,
    };
    return (
      <div>
        <h2>multiple readonly default selected item</h2>
        <div style={{ width: 300 }}>
          <Select
            multiple
            value={this.state.value}
            animation="slide-up"
            choiceTransitionName="rc-select-selection__choice-zoom"
            dropdownMenuStyle={dropdownMenuStyle}
            style={{ width: 500 }}
            optionFilterProp="children"
            optionLabelProp="children"
            placeholder="please select"
            onChange={this.onChange}
          >
            {children}
          </Select>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Test />, document.getElementById('__react-content'));
