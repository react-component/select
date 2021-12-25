/* eslint-disable no-console */
import React from 'react';
import Select, { Option } from 'rc-select';
import '../../assets/index.less';

class TabSelection extends React.Component {
  state = {
    tabSelection: true,
    value: '',
    options: [],
  };

  textareaRef = React.createRef<HTMLTextAreaElement>();

  timeoutId: number;

  componentDidMount() {
    console.log('Ref:', this.textareaRef);
  }

  onChange = (value, option) => {
    console.log('onChange', value, option);
    this.setState({
      value,
    });
  };

  onKeyDown = (e) => {
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

  toggleTabSelection = (event: any) => {
    this.setState({
      tabSelection: event.target.checked,
    });
  };

  render() {
    const { value, tabSelection } = this.state;
    return (
      <div>
        <h2>Tab Selection</h2>
        <input type="checkbox" name="tabSelection" checked={tabSelection} onChange={this.toggleTabSelection} />
        <label htmlFor="tabSelection"> use tab selection</label>
        <br />
        <br />

        <div>
          <Select
            style={{ width: 500 }}
            onChange={this.onChange}
            onSelect={this.onSelect}
            onSearch={this.onSearch}
            onInputKeyDown={this.onKeyDown}
            notFoundContent=""
            allowClear
            placeholder="please input, max len: 10"
            value={value}
            maxLength={10}
            mode="combobox"
            backfill
            tabSelection={tabSelection}
            onFocus={() => console.log('focus')}
            onBlur={() => console.log('blur')}
          >
            <Option value="vimlesai">
              <b style={{ color: 'red' }}>VimLeSai</b>
            </Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>
              disabled
            </Option>
            <Option value="martin">Martin</Option>
            <Option value="james">James</Option>
          </Select>
        </div>
      </div>
    );
  }
}

export default TabSelection;
/* eslint-enable */
