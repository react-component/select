'use strict';

import React from 'react';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.less';
import ReactDOM from 'react-dom';

var children = [];
for (var i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

function onChange(value) {
  console.log('selected ' + value);
}

function onSelect() {
  console.log(arguments);
}

function onDeselect() {
  console.log(arguments);
}

var Test = React.createClass({
  getInitialState(){
    return {
      useAnim: 0
    };
  },
  useAnim(e){
    this.setState({
      useAnim: e.target.checked
    });
  },
  render(){
    return (
      <div>
        <h2>multiple select（scroll the menu）</h2>

        <p>
          <label>anim <input checked={this.state.useAnim} type="checkbox" onChange={this.useAnim}/></label>
        </p>

        <div style={{width: 300}}>
          <Select
            animation={this.state.useAnim?"slide-up":null}
            dropdownMenuStyle={{
        maxHeight:200,
        overflow:'auto'
        }}
            style={{width:500}}
            multiple
            defaultValue={['name2', 'name3']}
            onSelect={onSelect}
            onDeselect={onDeselect}
            onChange={onChange}>
            {children}
          </Select>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<Test />, document.getElementById('__react-content'));
