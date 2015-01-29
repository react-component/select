# rc-select@1.x

<link href="../assets/index.css" rel="stylesheet" />
<link href="./index.css" rel="stylesheet" />

````html
<div id='ex1' class="wrapper">
</div>
````

````js
/** @jsx React.DOM */
var React = require('react'); 
var Select = require('../');
var Option = Select.Option;

var c = (
  <Select multiple>
    <Option value="1" selected>jack</Option>
    <Option value="2" selected>lucy</Option>
    <Option disabled>disabled</Option>
    <Option value="3">jim</Option>
  </Select>
);
React.render(c, document.getElementById('ex1'));
````