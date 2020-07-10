/* eslint-disable no-console */
import React from 'react';
import Select, { Option } from '../src';
import '../assets/index.less';

const children = [];
const plainOptions = [];
for (let i = 10; i < 36; i += 1) {
  children.push(
    <Option key={i.toString(36) + i} disabled={i === 10} title={`中文${i}`}>
      中文{i}
    </Option>,
  );
  plainOptions.push({ label: `中文${i}`, value: i.toString(36) + i });
}

class Test extends React.Component {
  state = {
    useAnim: false,
    showArrow: false,
    loading: false,
    value: ['a10'],
    useOptionsPassedByProps: false,
  };

  onChange = (value, options) => {
    console.log('onChange', value, options);
    this.setState({
      value,
    });
  };

  onSelect = (...args) => {
    console.log(args);
  };

  onDeselect = (...args) => {
    console.log(args);
  };

  useAnim = e => {
    this.setState({
      useAnim: e.target.checked,
    });
  };

  useOptionsPassedByProps = e => {
    this.setState({
      useOptionsPassedByProps: e.target.checked,
    });
  };

  showArrow = e => {
    this.setState({
      showArrow: e.target.checked,
    });
  };

  loading = e => {
    this.setState({
      loading: e.target.checked,
    });
  };

  render() {
    const { useAnim, showArrow, loading, useOptionsPassedByProps, value } = this.state;
    return (
      <div>
        <h2>multiple select（scroll the menu）</h2>

        <p>
          <label htmlFor="useAnim">
            anim
            <input id="useAnim" checked={useAnim} type="checkbox" onChange={this.useAnim} />
          </label>
          <p />
          <label htmlFor="showArrow">
            showArrow
            <input id="showArrow" checked={showArrow} type="checkbox" onChange={this.showArrow} />
          </label>
        </p>
        <p>
          <label htmlFor="loading">
            loading
            <input id="loading" checked={loading} type="checkbox" onChange={this.loading} />
          </label>
        </p>
        <p>
          <label htmlFor="useOptionPassedByProps">
            useOptionsPassedByProps
            <input
              id="useOptionPassedByProps"
              checked={useOptionsPassedByProps}
              type="checkbox"
              onChange={this.useOptionsPassedByProps}
            />
          </label>
        </p>

        <div style={{ width: 300 }}>
          <Select
            value={value}
            animation={useAnim ? 'slide-up' : null}
            choiceTransitionName="rc-select-selection__choice-zoom"
            style={{ width: 500 }}
            mode="multiple"
            loading={loading}
            showArrow={showArrow}
            allowClear
            optionFilterProp="children"
            optionLabelProp="children"
            onSelect={this.onSelect}
            onDeselect={this.onDeselect}
            placeholder="please select"
            onChange={this.onChange}
            onFocus={() => console.log('focus')}
            onBlur={v => console.log('blur', v)}
            tokenSeparators={[' ', ',']}
            options={useOptionsPassedByProps ? plainOptions : undefined}
          >
            {!useOptionsPassedByProps && children}
          </Select>
        </div>
      </div>
    );
  }
}

export default Test;
/* eslint-enable */
