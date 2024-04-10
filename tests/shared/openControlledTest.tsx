import * as React from 'react';
import Option from '../../src/Option';
import Select from '../../src/Select';
import { expectOpen } from '../utils/common';
import { render } from '@testing-library/react';

export default function openControlledTest(mode: any) {
  it('selectTriggerRef.props.visible should be equal to props.open', () => {
    const renderDemo = (open = true) => (
      <Select open={open} mode={mode}>
        <Option value="11">11</Option>
        <Option value="12">12</Option>
        <Option value="22">22</Option>
      </Select>
    );

    const { container, rerender } = render(renderDemo());
    expectOpen(container);

    rerender(renderDemo(false));
    expectOpen(container, false);
  });
}
