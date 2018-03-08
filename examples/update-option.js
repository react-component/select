/* eslint no-console: 0 */

import React from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

function handleChange(value) {
  console.log(`selected ${value}`);
}

class Test extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      label: 'Lucy',
      options: [],
    };
    this.count = 0;
  }

  updateLabel = () => {
    this.setState({
      label: `newlabel ${this.count++}`,
    });
  }

  updateOptions = (value) => {
    const options = [
      value,
      value + value,
      value + value + value,
    ];
    this.setState({
      options,
    });
  }

  render() {
    return (
      <div>
        label: {this.state.label}
        <hr />
        <Select
          defaultValue="lucy"
          optionLabelProp="children"
          style={{ width: 120 }}
          onChange={handleChange}
        >
          <Option value="lucy">{this.state.label}</Option>
          <Option value="lucy2">lucy2</Option>
        </Select>
        <p>
          <button onClick={this.updateLabel}>upadte option label</button>
        </p>
        <hr/>
        <Select
          combobox
          optionLabelProp="children"
          onChange={this.updateOptions}
        >
          {this.state.options.map((opt) => {
            return <Option key={opt}>{opt}</Option>;
          })}
        </Select>
        <hr/>
      </div>
    );
  }
}

ReactDOM.render(<Test />, document.getElementById('__react-content'));
