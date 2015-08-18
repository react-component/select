import React from 'react';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.less';

var Test = React.createClass({
  getInitialState() {
    return {
      options: []
    };
  },
  handleChange(value) {
    var options;
    if (!value || value.indexOf('@') >= 0) {
      options = [];
    } else {
      options = ['gmail.com', 'yahoo.com', 'outlook.com'].map(function(domain) {
        var email = value + '@' + domain;
        return <Option key={email}>{email}</Option>;
      });
    }
    this.setState({
      options: options
    });
  },
  render() {
    return <Select combobox
                   style={{width:200}}
                   onChange={this.handleChange}
                   searchPlaceholder="请输入账户名">
      {this.state.options}
    </Select>;
  }
});

React.render(<Test />, document.getElementById('__react-content'));
