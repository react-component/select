import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, { Simulate } from 'react-addons-test-utils';
import Select, { Option } from 'rc-select';
import $ from 'jquery';

describe('Combobox', () => {
  let div = null;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('should be combobox', () => {
    const instance = ReactDOM.render(
      <Select combobox>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>, div
    );
    expect(!!ReactDOM.findDOMNode(instance.refs.selection).getAttribute('tabindex')).to.be(false);
  });

  it('should has no open className', () => {
    const instance = ReactDOM.render(
      <Select combobox notFoundContent={false}/>, div
    );
    Simulate.click(instance.getInputDOMNode());
    expect(ReactDOM.findDOMNode(instance).className).not.to.contain('-open');
  });

  it('support defaultValue', () => {
    const instance = ReactDOM.render(
      <Select combobox defaultValue="1">
        <Option value="22222">22222</Option>
        <Option value="11111">11111</Option>
      </Select>, div
    );
    const input = ReactDOM.findDOMNode(TestUtils.scryRenderedDOMComponentsWithClass(instance,
      'rc-select-search__field')[0]);
    expect(input.value).to.be('1');
    Simulate.click(input);
    const activeItem = $(instance.getPopupDOMNode())
      .find('.rc-select-dropdown-menu-item-active')[0];
    expect(activeItem.innerHTML).to.be('11111');
    Simulate.click(activeItem);
    expect(input.value).to.be('11111');
  });

  it('do not keep active item', () => {
    const instance = ReactDOM.render(
      <Select combobox>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>, div
    );
    const input = instance.getInputDOMNode();
    input.value = '2';
    Simulate.change(input);
    let activeItem = $(instance.getPopupDOMNode()).find('.rc-select-dropdown-menu-item-active')[0];
    expect(activeItem.innerHTML).to.be('2');
    input.value = '';
    Simulate.change(input);
    activeItem = $(instance.getPopupDOMNode()).find('.rc-select-dropdown-menu-item-active')[0];
    expect(activeItem.innerHTML).to.be('1');
  });
});
