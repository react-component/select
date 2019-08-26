import React from 'react';
import Select, { Option } from '../src';
import '../assets/index.less';

class Combobox extends React.Component {
  state = {
    disabled: false,
    value: '',
  };

  onChange = (value, option) => {
    console.log('onChange', value, option);
    this.setState({
      value,
    });
  };

  onKeyDown = e => {
    const { value } = this.state;
    if (e.keyCode === 13) {
      console.log('onEnter', value);
    }
  };

  onSelect = (v, option) => {
    console.log('onSelect', v, option);
  };

  onSearch = (text: string) => {
    console.log('onSearch:', text);
  };

  toggleDisabled = () => {
    const { disabled } = this.state;
    this.setState({
      disabled: !disabled,
    });
  };

  render() {
    const { value, disabled } = this.state;
    return (
      <div>
        <h2>combobox</h2>
        <p>
          <button type="button" onClick={this.toggleDisabled}>
            toggle disabled
          </button>
        </p>
        <div>
          <Select
            disabled={disabled}
            style={{ width: 500 }}
            onChange={this.onChange}
            onSelect={this.onSelect}
            onSearch={this.onSearch}
            onInputKeyDown={this.onKeyDown}
            notFoundContent=""
            allowClear
            placeholder="please select"
            value={value}
            mode="combobox"
            backfill
            onFocus={() => console.log('focus')}
            onBlur={() => console.log('blur')}
          >
            <Option value="jack">
              <b style={{ color: 'red' }}>jack</b>
            </Option>
            <Option value="lucy">lucy</Option>
            <Option value="disabled" disabled>
              disabled
            </Option>
            <Option value="yiminghe">yiminghe</Option>
            <Option value="竹林星光">竹林星光</Option>
          </Select>

          <h3>Customize Input Element</h3>
          <Select
            mode="combobox"
            style={{ width: 200 }}
            getInputElement={() => <textarea rows={3} />}
            options={[{ value: 'light' }, { value: 'bamboo' }]}
            allowClear
            placeholder="2333"
          />
        </div>
      </div>
    );
  }
}

export default Combobox;