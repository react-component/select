/* eslint-disable no-undef,no-unused-vars */
const React = require('react');
const { mount } = require('enzyme');
const actualReactDOM = require.requireActual('react-dom');

const ReactDOM = jest.genMockFromModule('react-dom');

Object.keys(actualReactDOM).forEach(key => {
  ReactDOM[key] = actualReactDOM[key];
});

ReactDOM.unstable_renderSubtreeIntoContainer = () => {};

module.exports = ReactDOM;
