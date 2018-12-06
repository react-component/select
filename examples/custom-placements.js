/* eslint no-console: 0 */

import React from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

const customPlacements = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 0],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, 0],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  }
};

class Test extends React.Component {
  state = {
    value: '1',
  };

  onChange = (e) => {
    let value;
    if (e && e.target) {
      value = e.target.value;
    } else {
      value = e;
    }
    console.log('onChange', value);
    this.setState({
      value,
    });
  };
  
  onBlur = (v) => {
    console.log('onBlur', v);
  };

  onFocus = () => {
    console.log('onFocus');
  };

  render() {
    return (
      <div style={{ margin: 20 }}>
        <h2>Custom placements</h2>

        <div style={{ width: 300 }}>
          <Select
            id="my-select"
            value={this.state.value}
            placeholder="placeholder"
            dropdownMenuStyle={{ maxHeight: 200 }}
            style={{ width: 500 }}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            allowClear
            optionLabelProp="children"
            optionFilterProp="text"
            onChange={this.onChange}
            firstActiveValue="2"
            backfill
            builtinPlacements={customPlacements}
          >
            <Option value="1" text="one">One</Option>
            <Option value="2" text="two">Two</Option>
            <Option value="3" text="three">Three</Option>
            <Option value="4" text="four">Four</Option>
            <Option value="5" text="five">Five</Option>
          </Select>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Test />, document.getElementById('__react-content'));
