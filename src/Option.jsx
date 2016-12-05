import React, { PropTypes } from 'react';

export default class Option extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  };
}
