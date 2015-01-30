# rc-select@1.x

<link href="../assets/index.css" rel="stylesheet" />
<link href="./index.css" rel="stylesheet" />

````html
<style>
#ex2 .select-menu{
  height: 200px; 
  overflow:auto;
}
</style>

<div class="wrapper">
  <h3>single select</h3>
  <div id="ex1"></div>
  
  <h3>multiple select（scroll the menu）</h3>
  <div id="ex2"></div>
  
  <h3>combobox select</h3>
  <div id="ex3"></div>
</div>
````

````js
/** @jsx React.DOM */
var React = require('react'); 
var Select = require('../');
var Option = Select.Option;
var Combobox = Select.Combobox;

var style = {
  color: 'red'
};
function handleSelect(selectedKey, obj) {
  console.log('selected ' + selectedKey, obj);
}
function handleDeselect(selectedKey, obj) {
  console.log('deselect ' + selectedKey, obj);
}

var c1 = (
  <Select value="disabled" className="forTest" onSelect={handleSelect} onDeselect={handleDeselect}>
    <Option value="jack" className="forTest"><b style={style}>jack</b></Option>
    <Option value="lucy">lucy</Option>
    <Option value="disabled" disabled>disabled</Option>
    <Option value="jim">jim</Option>
  </Select>
);


var children = [];
for(var i = 10; i < 36; i++){
  children.push(<Option value={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}
var c2 = (
  <Select multiple value={['name2', 'name3']}>
    {children}
  </Select>
);


var c3 = (
  <Combobox>
    <Option value="jack"><b style={style}>jack</b></Option>
    <Option value="lucy" >lucy</Option>
    <Option value="disabled" disabled>disabled</Option>
    <Option value="jim">jim</Option>
  </Combobox>
);

React.render(c1, document.getElementById('ex1'));
React.render(c2, document.getElementById('ex2'));
React.render(c3, document.getElementById('ex3'));
````