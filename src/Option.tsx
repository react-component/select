import PropTypes from 'prop-types';
import React from 'react';

export default class Option extends React.Component {
  public static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  public static isSelectOption = true;
}
