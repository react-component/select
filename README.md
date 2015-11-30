# rc-select
---

React Select

[![NPM version][npm-image]][npm-url]
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
    <Option value="jack">jack</Option>
    <Option value="lucy">lucy</Option>
    <Option value="jim">jim</Option>
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
          <td>filterOption</td>
          <td></td>
          <td>true|Function(inputValue:string, option:Option)</td>
          <td>whether filter options by input value. default filter by option's optionFilterProp prop's value</td>
        </tr>
        <tr>
          <td>optionLabelProp</td>
          <td>String</td>
          <td>value</td>
          <td>which prop value of option will render as content of select</td>
        </tr>
        <tr>
          <td>optionFilterProp</td>
          <td>String</td>
          <td>value</td>
          <td>which prop value of option will be used for filter if filterOption is true</td>
        </tr>
        <tr>
          <td>showSearch</td>
          <td>Boolean</td>
          <td>true</td>
          <td>whether show search input in single mode</td>
        </tr>
        <tr>
          <td>onSearch</td>
          <td>Function</td>
          <td></td>
          <td>called when input changed</td>
        </tr>
        <tr>
          <td>disabled</td>
          <td>Boolean</td>
          <td>false</td>
          <td>whether disabled select</td>
        </tr>
        <tr>
          <td>animation</td>
          <td>String</td>
          <td></td>
          <td>dropdown animation name. only support slide-up now</td>
        </tr>
        <tr>
          <td>transitionName</td>
          <td>String</td>
          <td></td>
          <td>dropdown css animation name</td>
        </tr>
        <tr>
          <td>choiceTransitionName</td>
          <td>String</td>
          <td></td>
          <td>css animation name for selected items at multiple mode</td>
        </tr>
        <tr>
          <td>defaultValue</td>
          <td>String | Array&lt;String&gt;</td>
          <td></td>
          <td>initial selected option(s)</td>
        </tr>
        <tr>
          <td>value</td>
          <td>String | Array&lt;String&gt;</td>
          <td></td>
          <td>current selected option(s)</td>
        </tr>
        <tr>
          <td>defaultValue</td>
          <td>String | Array&lt;String&gt;</td>
          <td></td>
          <td>specify the default selected option(s)</td>
        </tr>
        <tr>
          <td>multiple</td>
          <td></td>
          <td>false</td>
          <td>can select more than one option</td>
        </tr>
        <tr>
          <td>tags</td>
          <td></td>
          <td>false</td>
          <td>when tagging is enabled the user can select from pre-existing options or create a new tag by picking the first choice, which is what the user has typed into the search box so far.</td>
        </tr>
        <tr>
          <td>maxTagTextLength</td>
          <td></td>
          <td></td>
          <td>max tag text length to show</td>
        </tr>
        <tr>
          <td>allowClear</td>
          <td></td>
          <td>false</td>
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
          <td>Function(value:string, option:Option)</td>
          <td></td>
          <td>called when a option is selected. param is option's value and option instance</td>
        </tr>
        <tr>
          <td>onDeselect</td>
          <td>Function</td>
          <td></td>
          <td>called when a option is deselected. param is option's value. only called for multiple or tags</td>
        </tr>
        <tr>
          <td>onChange</td>
          <td>function(value, label)</td>
          <th></th>
          <td>called when select an option or input value change(combobox).</td>
        </tr>
        <tr>
          <td>dropdownMatchSelectWidth</td>
          <td>Boolean</td>
          <th>true</th>
          <td>whether dropdown 's with is same with select</td>
        </tr>
        <tr>
          <td>dropdownClassName</td>
          <td>String</td>
          <th></th>
          <td>additional className applied to dropdown</td>
        </tr>
        <tr>
          <td>dropdownStyle</td>
          <td>Object</td>
          <th>{}</th>
          <td>additional style applied to dropdown</td>
        </tr>
        <tr>
          <td>dropdownMenuStyle</td>
          <td>Object</td>
          <th>{}</th>
          <td>additional style applied to dropdown menu</td>
        </tr>
        <tr>
          <td>notFoundContent</td>
          <td>String</td>
          <td></td>
          <td>specify content to show when no result matches. defaults to Not Found</td>
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
            <td>disabled</td>
            <td>Boolean</td>
            <th>false</th>
            <td>no effect for click or keydown for this item</td>
        </tr>
        <tr>
          <td>key</td>
          <td>String</td>
          <td></td>
          <td>if react want you to set key, then key is same as value, you can omit value.</td>
        </tr>
        <tr>
          <td>value</td>
          <td>String</td>
          <td></td>
          <td>default filter by this attribute. if react want you to set key, then key is same as value, you can omit value.</td>
        </tr>
    </tbody>
</table>


### OptGroup props

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
          <td>label</td>
          <td>String|React.Element</td>
          <td></td>
          <td>group label</td>
        </tr>
        <tr>
          <td>key</td>
          <td>String</td>
          <td></td>
          <td></td>
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
