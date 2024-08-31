import * as React from 'react';
import Select, { type BaseSelectRef } from '../src';
import { injectRunAllTimers } from './utils/common';
import { render } from '@testing-library/react';

describe('React', () => {
  injectRunAllTimers(jest);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('not warning findDOMNode', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Select open getRawInputElement={() => <a />} />);

    expect(errSpy).not.toHaveBeenCalled();
    errSpy.mockRestore();
  });

  describe('nativeElement', () => {
    it('work', () => {
      const selectRef = React.createRef<BaseSelectRef>();
      const { container } = render(<Select ref={selectRef} />);

      expect(selectRef.current?.nativeElement).toBe(container.querySelector('.rc-select'));
    });

    it('getRawInputElement', () => {
      const selectRef = React.createRef<BaseSelectRef>();
      const { container } = render(
        <Select ref={selectRef} getRawInputElement={() => <a className="bamboo" />} />,
      );

      expect(selectRef.current?.nativeElement).toBe(container.querySelector('a.bamboo'));
    });
  });
});
