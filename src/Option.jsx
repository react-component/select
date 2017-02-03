import React from 'react';

export default class Option extends React.Component {
  static propTypes = {
    value: React.PropTypes.string,
  };

  static isSelectOption = true;
}
