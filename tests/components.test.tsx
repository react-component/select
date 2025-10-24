import { render } from '@testing-library/react';
import React from 'react';
import Select from '../src';
import { injectRunAllTimers } from './utils/common';

describe('Select.Components', () => {
  injectRunAllTimers(jest);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should pass placeholder to custom input', () => {
    const { container } = render(
      <Select mode="combobox" getInputElement={() => <textarea />} placeholder="test" />,
    );

    expect(container.querySelector('textarea')?.getAttribute('placeholder')).toBe('test');
  });
});
