/* eslint-disable no-undef,no-unused-vars */
const React = require('react');
const { mount } = require('enzyme');
const actualReactDom = require.requireActual('react-dom');

const ReactDOM = jest.genMockFromModule('react-dom');

Object.keys(actualReactDom).forEach(key => {
  ReactDOM[key] = actualReactDom[key];
});

ReactDOM.unstable_renderSubtreeIntoContainer = (
  parentComponent,
  nextElement,
  container,
  callback
) => {
  ReactDOM.currentTrigger = mount(nextElement);
  callback();
};

module.exports = ReactDOM;
