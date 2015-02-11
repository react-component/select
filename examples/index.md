# rc-select@2.x
---

<link href="../assets/index.css" rel="stylesheet" />
<link href="./index.css" rel="stylesheet" />

<style>
#ex1,#ex2,#ex3 {
  width:300px;
}
</style>

## single select

<div id="ex1"></div>

````js
/** @jsx React.DOM */
(function(){
var React = require('react');
var Select = require('../');
var Option = Select.Option;

var style = {
  color: 'red'
};

function handleChange(value) {
  console.log('selected ' + value);
}

var c1 = (
  <Select value="lucy" className="forTest" onChange={handleChange}>
    <Option value="jack" className="forTest"><b style={style}>jack</b></Option>
    <Option value="lucy">lucy</Option>
    <Option value="disabled" disabled>disabled</Option>
    <Option value="yiminghe">yiminghe</Option>
  </Select>
);

React.render(c1, document.getElementById('ex1'));
})();
````

## multiple select（scroll the menu）

<div id="ex2"></div>

````html
<style>
#ex2 .rc-select-menu{
  height: 200px;
  overflow:auto;
}
</style>
````

````js
(function(){
/** @jsx React.DOM */
var React = require('react');
var Select = require('../');
var Option = Select.Option;

var children = [];
for(var i = 10; i < 36; i++){
  children.push(<Option value={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

function handleChange(value) {
  console.log('selected ' + value);
}

var c2 = (
  <Select multiple value={['name2', 'name3']} onChange={handleChange}>
    {children}
  </Select>
);

React.render(c2, document.getElementById('ex2'));
})();
````

## combobox

<div id="ex3"></div>

````js
/** @jsx React.DOM */
var React = require('react');
var Select = require('../');
var Option = Select.Option;
var style = {
  color: 'red'
};
var c3 = (
  <Select combobox>
    <Option value="jack"><b style={style}>jack</b></Option>
    <Option value="lucy" >lucy</Option>
    <Option value="disabled" disabled>disabled</Option>
    <Option value="yiminghe">yiminghe</Option>
  </Select>
);

React.render(c3, document.getElementById('ex3'));
````