import React, { useLayoutEffect, useRef, useState } from 'react';
import type { BaseSelectRef } from '@rc-component/select';
import Select, { Option } from '@rc-component/select';
import '../../assets/index.less';

const MySelect = () => {
  const ref = useRef<BaseSelectRef>(null);
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.focus({ preventScroll: true });
    }
  }, []);
  return (
    <div>
      <Select placeholder="placeholder" showSearch ref={ref}>
        <Option value="11" text="lucy">
          lucy
        </Option>
        <Option value="21" text="disabled">
          disabled
        </Option>
      </Select>
    </div>
  );
};

const Demo = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div style={{ height: '50vh' }} />
      <a onClick={() => setOpen(!open)}>{`${open}`}</a>
      <div style={{ height: '80vh' }} />
      {open && <MySelect />}
      <div style={{ height: '30vh' }} />
    </div>
  );
};

export default Demo;
