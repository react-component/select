import * as React from 'react';
import Select, { Option } from '../../src';
import { fireEvent, render } from '@testing-library/react';

export default function hoverTest(mode: any) {
  it('triggers mouseEnter and mouseLeave', () => {
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();
    const { container } = render(
      <Select mode={mode} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    // wrapper.find('.rc-select').first().simulate('mouseenter');
    fireEvent.mouseEnter(container.querySelector('.rc-select'));
    expect(onMouseEnter).toBeCalled();
    // wrapper.find('.rc-select').first().simulate('mouseleave');
    fireEvent.mouseLeave(container.querySelector('.rc-select'));
    expect(onMouseLeave).toBeCalled();
  });
}
