import React, {PropTypes} from 'react';

const DropdownInner = React.createClass({
  propTypes: {
    hiddenClassName: PropTypes.string,
    className: PropTypes.string,
    dropdownStyle: PropTypes.object,
    onDropdownFocus: PropTypes.func,
    onDropdownBlur: PropTypes.func,
    children: PropTypes.any,
  },
  render() {
    const props = this.props;
    let className = props.className;
    if (!props.visible) {
      className += ' ' + props.hiddenClassName;
    }
    return (<div onFocus={props.onDropdownFocus}
                 onBlur={props.onDropdownBlur}
                 style={props.dropdownStyle}
                 className={className}
                 tabIndex="-1">
      {props.children}
    </div>);
  },
});

export default DropdownInner;
