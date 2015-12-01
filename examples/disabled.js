import React from 'react';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const Test = React.createClass({
  getInitialState() {
    return {
      destroy: false,
      value: '1',
    };
  },

  onChange(e) {
    let value;
    if (e.target) {
      value = e.target.value;
    } else {
      value = e;
    }
    this.setState({value});
  },

  handleDestroy() {
    this.setState({
      destroy: 1,
    });
  },

  render() {
    if (this.state.destroy) {
      return null;
    }
    const dropdownMenuStyle = {
      maxHeight: 200,
      overflow: 'auto',
    };
    return (
      <div style={{margin: 20}}>
        <div style={{height: 150}}/>

        <h2>Single Disabled Select</h2>

        <div style={{width: 300}}>
          <Select disabled
                  value={this.state.value}
                  dropdownMenuStyle={{maxHeight: 200, overflow: 'auto'}}
                  style={{width: 500}}
                  onChange={this.onChange}>
            <Option value="jack">
              <b style={{
                color: 'red',
              }}>jack</b>
            </Option>
            <Option value="lucy">lucy</Option>
            <Option value="disabled" disabled>disabled</Option>
            <Option value="yiminghe">yiminghe</Option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
              return <Option key={i + ''}>{i + ''}</Option>;
            })}
          </Select>
        </div>

        <h2>Multiple Disabled Select</h2>

        <div style={{width: 300}}>
          <Select disabled
            animation={this.state.useAnim ? 'slide-up' : null}
            dropdownMenuStyle={dropdownMenuStyle}
            style={{width: 500}}
            multiple
            defaultValue={['name2', 'name3']}>
            {children}
          </Select>
        </div>
      </div>
    );
  },
});

ReactDOM.render(<Test />, document.getElementById('__react-content'));
