/* eslint-disable no-console */
import React from 'react';
import Select, { Option } from '../src';
import '../assets/index.less';

function handleChange(value) {
  console.log(`selected ${value}`);
}

class Test extends React.Component {
  count: number;

  constructor(props) {
    super(props);

    this.count = 0;
  }

  state = {
    label: 'Lucy',
    options: [],
  };

  updateLabel = () => {
    this.setState({
      label: `newlabel ${this.count}`,
    });
    this.count += 1;
  };

  updateOptions = value => {
    const options = [value, value + value, value + value + value];
    this.setState({
      options,
    });
  };

  render() {
    const { label, options } = this.state;

    return (
      <div>
        label: {label}
        <hr />
        <Select
          defaultValue="lucy"
          optionLabelProp="children"
          style={{ width: 120 }}
          onChange={handleChange}
        >
          <Option value="lucy">{label}</Option>
          <Option value="lucy2">lucy2</Option>
        </Select>
        <p>
          <button type="button" onClick={this.updateLabel}>
            update option label
          </button>
        </p>
        <hr />
        <Select mode="combobox" optionLabelProp="children" onChange={this.updateOptions}>
          {options.map(opt => (
            <Option key={opt}>{opt}</Option>
          ))}
        </Select>
        <hr />
      </div>
    );
  }
}

export default Test;
/* eslint-enable */
