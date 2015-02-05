# rc-select
---

select ui component for react

[![NPM version][npm-image]][npm-url]
[![SPM version](http://spmjs.io/badge/rc-select)](http://spmjs.io/package/rc-select)
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]
[![Sauce Test Status](https://saucelabs.com/buildstatus/rc-select)](https://saucelabs.com/u/rc-select)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/rc-select.svg)](https://saucelabs.com/u/rc-select)

[npm-image]: http://img.shields.io/npm/v/rc-select.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-select
[travis-image]: https://img.shields.io/travis/react-component/select.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/select
[coveralls-image]: https://img.shields.io/coveralls/react-component/select.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/select?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/select.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/select
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-select.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-select

## Screenshots

<img src="https://tfsimg.alipay.com/images/T1CUBeXa0kXXXXXXXX.png" />

## Feature

* support ie8,ie8+,chrome,firefox,safari

### Keyboard

* Open select (focus input || focus and click)
* Previous item (PageUp)
* Next item (PageDown)


## install

[![rc-select](https://nodei.co/npm/rc-select.png)](https://npmjs.org/package/rc-select)

## Usage

### basic use
```js
var React = require('react'); 
var Select = require('../');
var Option = Select.Option;

var c = (
  <Select>
    <Option value="1">jack</Option>
    <Option value="2">lucy</Option>
    <Option value="3">jim</Option>
  </Select>
);
React.render(c, container);
```


## API

### Select props

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>className</td>
          <td>String</td>
          <td></td>
          <td>additional css class of root dom node</td>
        </tr>
        <tr>
          <td>value</td>
          <td>String | Array</td>
          <td></td>
          <td>specify the default selected item(s)</td>
        </tr> 
        <tr>
          <td>multiple</td>
          <td></td>
          <td>false</td>
          <td>can select more than one option </td>
        </tr>           
        <tr>
          <td>allowClear</td>
          <td></td>
          <td>false</td>
          <td></td>
        </tr>
        <tr>
          <td> maximumSelectionLength </td>
          <td></td>
          <td></td>
          <td>Select multi-value select boxes can set restrictions regarding the maximum number of options selected</td>
        </tr>                  
        <tr>
            <td>onSelect</td>
            <td>function(key:String,child:ReactComponent)</td>
            <th></th>
            <td>called when select an option</td>
        </tr>
        <tr>
            <td>onDeselect</td>
            <td>function(key:String,child:ReactComponent)</td>
            <th></th>
            <td>called when deselect an option (for mutiple select)</td>
        </tr>
        </tr>        
    </tbody>
</table>

### Option props

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>className</td>
          <td>String</td>
          <td></td>
          <td>additional css class of root dom node</td>
        </tr>
        <tr>
            <td>disabled</td>
            <td>Boolean</td>
            <th>false</th>
            <td>no effect for click or keydown for this item</td>
        </tr>        
        <tr>
          <td>value</td>
          <td>String</td>
          <td></td>
          <td>search by this attribute</td>
        </tr>
    </tbody>
</table>


### Combobox props (autocomplete)

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>className</td>
          <td>String</td>
          <td></td>
          <td>additional css class of root dom node</td>
        </tr>
        <tr>
          <td>value</td>
          <td>String</td>
          <td></td>
          <td>default value in input control</td>
        </tr>
    </tbody>
</table>


online docs: http://spmjs.io/docs/rc-select/

## Development

```
npm install
npm start
```

## Example

http://localhost:8003/examples/index.md

online example: http://spmjs.io/docs/rc-select/examples/

## Test Case

http://localhost:8003/tests/runner.html?coverage

## Coverage

http://localhost:8003/node_modules/rc-server/node_modules/node-jscover/lib/front-end/jscoverage.html?w=http://localhost:8003/tests/runner.html?coverage

## License

rc-select is released under the MIT license.
