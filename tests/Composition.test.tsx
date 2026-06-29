import { createEvent, fireEvent, render } from '@testing-library/react';
import KeyCode from 'rc-util/lib/KeyCode';
import { act } from 'react';
import Select, { Option } from '../src';
import { keyDown } from './utils/common';

// The keydown that confirms an IME composition still reports `which === ENTER`
// on some browsers (e.g. Safari) while `isComposing` is true.
function imeEnterKeyDown(element: HTMLElement) {
  const event = createEvent.keyDown(element, { keyCode: KeyCode.ENTER });
  Object.defineProperties(event, {
    which: { get: () => KeyCode.ENTER },
    isComposing: { get: () => true },
  });
  act(() => {
    fireEvent(element, event);
  });
}

describe('Select.Composition', () => {
  it('does not select the active option when Enter only confirms the IME composition', () => {
    const onChange = jest.fn();
    const onSelect = jest.fn();
    const { container } = render(
      <Select showSearch open onChange={onChange} onSelect={onSelect}>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>,
    );

    imeEnterKeyDown(container.querySelector('input'));

    expect(onChange).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('still selects the active option on a normal Enter', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Select showSearch open onChange={onChange}>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
      </Select>,
    );

    keyDown(container.querySelector('input'), KeyCode.ENTER);

    expect(onChange).toHaveBeenCalledWith('1', expect.anything());
  });
});
