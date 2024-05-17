import * as React from 'react';
import Select from '../src';
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
});
