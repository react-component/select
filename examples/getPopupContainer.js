import React from 'react';
import ReactDOM from 'react-dom';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.less';
import Dialog from 'rc-dialog';
import 'rc-dialog/assets/index.css';

class Test extends React.Component {
  state = {
    open: false,
    destroy: false,
  };

  getPopupContainer = node => {
    return node.parentNode;
  };

  setVisible = open => {
    this.setState({
      open,
    });
  };

  open = () => {
    this.setVisible(true);
  };

  close = () => {
    this.setVisible(false);
  };

  destroy = () => {
    this.setState({
      destroy: true,
    });
  };

  render() {
    const { open, destroy } = this.state;
    if (destroy) {
      return null;
    }
    return (
      <div>
        <button type="button" onClick={this.open}>
          open
        </button>
        &nbsp;
        <button type="button" onClick={this.destroy}>
          destroy
        </button>
        <Dialog visible={open} onClose={this.close}>
          <div style={{ marginTop: 20, position: 'relative' }}>
            <Select
              placeholder="placeholder"
              style={{ width: 200 }}
              getPopupContainer={this.getPopupContainer}
            >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
            </Select>
          </div>
        </Dialog>
      </div>
    );
  }
}

ReactDOM.render(<Test />, document.getElementById('__react-content'));
