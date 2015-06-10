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
[![Sauce Test Status](https://saucelabs.com/buildstatus/rc_select)](https://saucelabs.com/u/rc_select)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/rc_select.svg)](https://saucelabs.com/u/rc_select)

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
* KeyDown/KeyUp/Enter to navigate menu

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
          <td>String | Array<String></td>
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
          <td>filterOption</td>
          <td></td>
          <td>true</td>
          <td>whether filter options by input value</td>
        </tr>
        <tr>
          <td>tags</td>
          <td></td>
          <td>false</td>
          <td>when tagging is enabled the user can select from pre-existing options or create a new tag by picking the first choice, which is what the user has typed into the search box so far.</td>
        </tr>
        <tr>
          <td>allowClear</td>
          <td></td>
          <td>true</td>
          <td></td>
        </tr>
        <tr>
          <td>combobox</td>
          <td></td>
          <td>false</td>
          <td>enable combobox mode(can not set multiple at the same time)</td>
        </tr>
        <tr>
          <td>onSelect</td>
          <td>Function</td>
          <td></td>
          <td>called when a option is selected. param is option's value</td>
        </tr>
        <tr>
          <td>onDeselect</td>
          <td>Function</td>
          <td></td>
          <td>called when a option is deselected. param is option's value. only called for multiple or tags</td>
        </tr>
        <tr>
            <td>onChange</td>
            <td>function(value)</td>
            <th></th>
            <td>called when select an option or input value change(combobox)</td>
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

## Development

```
npm install
npm start
```

## Example

http://localhost:8003/examples/

online example: http://react-component.github.io/select/examples/

## Test Case

http://localhost:8003/tests/runner.html?coverage

## Coverage

http://localhost:8003/node_modules/rc-server/node_modules/node-jscover/lib/front-end/jscoverage.html?w=http://localhost:8003/tests/runner.html?coverage

## License

rc-select is released under the MIT license.
