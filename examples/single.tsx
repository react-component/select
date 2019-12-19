/* eslint-disable no-console */
import React from 'react';
import Select, { Option } from '../src';
import '../assets/index.less';

class Test extends React.Component {
  state = {
    destroy: false,
    value: '9',
  };

  onChange = e => {
    let value;
    if (e && e.target) {
      ({ value } = e.target);
    } else {
      value = e;
    }
    console.log('onChange', value);
    this.setState({
      value,
    });
  };

  onDestroy = () => {
    this.setState({
      destroy: 1,
    });
  };

  onBlur = v => {
    console.log('onBlur', v);
  };

  onFocus = () => {
    console.log('onFocus');
  };

  onSearch = val => {
    console.log('Search:', val);
  };

  render() {
    const { value, destroy } = this.state;
    if (destroy) {
      return null;
    }

    return (
      <div style={{ margin: 20 }}>
        <div
          style={{ height: 150, background: 'rgba(0, 255, 0, 0.1)' }}
          onMouseDown={e => {
            e.preventDefault();
          }}
        >
          Prevent Default
        </div>

        <h2>Single Select</h2>

        <div style={{ width: 300 }}>
          <Select
            autoFocus
            id="my-select"
            value={value}
            placeholder="placeholder"
            showSearch
            style={{ width: 500 }}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onSearch={this.onSearch}
            allowClear
            optionFilterProp="text"
            onChange={this.onChange}
            backfill
            onPopupScroll={(...args) => {
              console.log('Scroll:', args);
            }}
          >
            <Option value="01" text="jack" title="jack">
              <b
                style={{
                  color: 'red',
                }}
              >
                jack
              </b>
            </Option>
            <Option value="11" text="lucy">
              lucy
            </Option>
            <Option value="21" disabled text="disabled">
              disabled
            </Option>
            <Option value="31" text="yiminghe">
              yiminghe
            </Option>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <Option key={i} value={String(i)} text={String(i)}>
                {i}-text
              </Option>
            ))}
          </Select>
        </div>
        <h2>native select</h2>
        <select value={value} style={{ width: 500 }} onChange={this.onChange}>
          <option value="01">jack</option>
          <option value="11">lucy</option>
          <option value="21" disabled>
            disabled
          </option>
          <option value="31">yiminghe</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <option value={i} key={i}>
              {i}
            </option>
          ))}
        </select>

        <p>
          <button type="button" onClick={this.onDestroy}>
            destroy
          </button>
        </p>
      </div>
    );
  }
}

export default Test;
/* eslint-enable */
