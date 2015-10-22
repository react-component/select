import React from 'react';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

var Test = React.createClass({
  getInitialState() {
    return {
      options: []
    };
  },
  onSelect(value){
    console.log('onSelect', value);
  },
  onChange(value) {
    console.log('onChange', value);
    var options;
    if (!value || value.indexOf('@') >= 0) {
      options = <Option key={value}>{value}</Option>;
    } else {
      options = ['gmail.com', 'yahoo.com', 'outlook.com'].map(function (domain) {
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
                   onChange={this.onChange}
                   onSelect={this.onSelect}
                   searchPlaceholder="请输入账户名">
      {this.state.options}
    </Select>;
  }
});

ReactDOM.render(<Test />, document.getElementById('__react-content'));
