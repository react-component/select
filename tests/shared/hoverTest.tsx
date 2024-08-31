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

    fireEvent.mouseEnter(container.querySelector('.rc-select'));
    expect(onMouseEnter).toBeCalled();
    fireEvent.mouseLeave(container.querySelector('.rc-select'));
    expect(onMouseLeave).toBeCalled();
  });
}
