'use strict';

import React from 'react';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

var children = [];
for (var i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

var Test = React.createClass({
  getInitialState() {
    return {
      disabled: false,
      value: ['name2', 'name3']
    };
  },
  handleChange(value) {
    console.log('selected ' + value);
    this.setState({
      value: value
    });
  },
  handleDisabled() {
    this.setState({
      disabled: !this.state.disabled
    });
  },
  render() {
    return (
      <div>
        <h2>tags select（scroll the menu）</h2>

        <div>
          <Select tags
                  dropdownMenuStyle={{maxHeight:200,overflow:'auto'}}
                  style={{width:500}}
                  disabled={this.state.disabled}
                  maxTagTextLength={10}
                  value={this.state.value}
                  onChange={this.handleChange}>
            {children}
          </Select>
        </div>
        <p>
          <button onClick={this.handleDisabled}>toggle disabled</button>
        </p>
      </div>
    );
  }
});

ReactDOM.render(<Test />, document.getElementById('__react-content'));
