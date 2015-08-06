'use strict';

import React from 'react';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.less';

var children = [];
for (var i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

function handleChange(value) {
  console.log('selected ' + value);
}

var c2 = (
  <div>
    <h2>multiple select（scroll the menu）</h2>
    <div style={{width: 300}}>
      <Select
        dropdownMenuStyle={{
        maxHeight:200,
        overflow:'auto'
        }}
        renderDropdownToBody={location.href.indexOf('renderDropdownToBody') !== -1}
        style={{width:500}}
        multiple
        value={['name2', 'name3']}
        onChange={handleChange}>
    {children}
      </Select>
    </div>
  </div>
);

React.render(c2, document.getElementById('__react-content'));
