import * as React from 'react';
import Option from '../../src/Option';
import Select from '../../src/Select';
import { fireEvent, render } from '@testing-library/react';

export default function keyDownTest(mode: any) {
  it('triggers keyDown', () => {
    const onInputKeyDown = jest.fn();
    const { container } = render(
      <Select mode={mode} onInputKeyDown={onInputKeyDown}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
      </Select>,
    );

    fireEvent.keyDown(container.querySelector('input'));
    expect(onInputKeyDown).toHaveBeenCalled();
  });
}
