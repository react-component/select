import 'rc-dialog/assets/index.css';
import '../../assets/index.less';

import Dialog from 'rc-dialog';
import Select, { type SelectProps } from '@rc-component/select';
import React from 'react';

const MySelect = (props: Partial<SelectProps>) => (
  <Select
    placeholder="placeholder"
    style={{ width: 100 }}
    getPopupContainer={(node) => node.parentNode}
    options={new Array(3).fill(null).map((_, index) => ({
      value: index,
      label: `long_label_${index}`,
    }))}
    {...props}
  />
);

class Test extends React.Component {
  state = {
    open: false,
    destroy: false,
  };

  setVisible = (open) => {
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
            <MySelect />
          </div>
        </Dialog>
        <div
          style={{
            transform: 'scale(1.5)',
            transformOrigin: '0 0',
            display: 'flex',
            columnGap: 16,
            flexWrap: 'wrap',
          }}
        >
          <h3 style={{ width: '100%' }}>Transform: 150%</h3>
          <MySelect />
          <MySelect popupMatchSelectWidth />
          <MySelect popupMatchSelectWidth={false} />
          <MySelect popupMatchSelectWidth={300} />
        </div>
      </div>
    );
  }
}

export default Test;
