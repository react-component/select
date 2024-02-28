import React, { useEffect, useRef, useState } from 'react';
import type { BaseSelectRef } from 'rc-select';
import Select, { Option } from 'rc-select';
import '../../assets/index.less';

const MySelect = () => {
  const ref = useRef<BaseSelectRef>(null);
  // useLayoutEffect(() => {
  //   if (ref.current) {
  //     ref.current.focus({ preventScroll: true });
  //   }
  // }, []);
  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        console.log('1', ref.current);
        ref.current.focus({ preventScroll: true });
      }
    });
  }, []);
  return (
    <div>
      <Select autoFocus placeholder="placeholder" ref={ref}>
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
// const MySelect = () => {
//   const ref = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     setTimeout(() => {
//       if (ref.current) {
//         ref.current.focus();
//       }
//     });
//   }, []);
//   return <div ref={ref}>哈哈哈哈</div>;
// };

const Demo = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div style={{ height: '50vh' }} />
      <a onClick={() => setOpen(!open)}>open</a>
      <div style={{ height: '80vh' }} />
      {open && <MySelect />}
      <div style={{ height: '30vh' }} />
    </div>
  );
};

export default Demo;
