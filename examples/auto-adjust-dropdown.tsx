/* eslint-disable no-console */
import React from 'react';
import Select, { Option } from '../src';
import '../assets/index.less';

class Test extends React.Component {
  state = {
    value: '3',
  };

  onChange = e => {
    let value;
    if (e && e.target) {
      ({ value } = e.target);
    } else {
      value = e;
    }
    this.setState({
      value,
    });
  };

  render() {
    const { value } = this.state;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: 'calc(100vh - 16px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Select
              onChange={this.onChange}
              dropdownMatchSelectWidth={500}
              value={value}
            >
              <Option value="1">
                Jack Jack Jack Jack Jack Jack Jack Jack Jack Jack Jack
              </Option>
              <Option value="2">
                Lucy Lucy Lucy Lucy Lucy Lucy Lucy Lucy Lucy Lucy
              </Option>
              <Option value="3">Jill</Option>
            </Select>
          </div>
          <div>
            <Select
              onChange={this.onChange}
              dropdownMatchSelectWidth={500}
              value={value}
            >
              <Option value="1">
                Jack Jack Jack Jack Jack Jack Jack Jack Jack Jack Jack
              </Option>
              <Option value="2">
                Lucy Lucy Lucy Lucy Lucy Lucy Lucy Lucy Lucy Lucy
              </Option>{' '}
              <Option value="3">Jill</Option>
            </Select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div>
            <Select
              onChange={this.onChange}
              dropdownMatchSelectWidth={500}
              value={value}
            >
              <Option value="1">
                Jack Jack Jack Jack Jack Jack Jack Jack Jack Jack Jack
              </Option>
              <Option value="2">
                Lucy Lucy Lucy Lucy Lucy Lucy Lucy Lucy Lucy Lucy
              </Option>
              <Option value="3">Jill</Option>
            </Select>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Select
              onChange={this.onChange}
              dropdownMatchSelectWidth={500}
              value={value}
            >
              <Option value="1">
                Jack Jack Jack Jack Jack Jack Jack Jack Jack Jack Jack
              </Option>
              <Option value="2">
                Lucy Lucy Lucy Lucy Lucy Lucy Lucy Lucy Lucy Lucy
              </Option>
              <Option value="3">Jill</Option>
            </Select>
          </div>
          <div>
            <Select
              onChange={this.onChange}
              dropdownMatchSelectWidth={500}
              value={value}
            >
              <Option value="1">
                Jack Jack Jack Jack Jack Jack Jack Jack Jack Jack Jack
              </Option>
              <Option value="2">
                Lucy Lucy Lucy Lucy Lucy Lucy Lucy Lucy Lucy Lucy
              </Option>
              <Option value="3">Jill</Option>
            </Select>
          </div>
        </div>
      </div>
    );
  }
}

export default Test;
/* eslint-enable */
