import React from 'react';
import Select from '../src';
import { toggleOpen } from './utils/common';
import { render } from '@testing-library/react';

describe('Select placeholder', () => {
  it('when searchValue is controlled', () => {
    const { container } = render(<Select searchValue="light" placeholder="bamboo" />);
    expect(container.querySelector('.rc-select-selection-placeholder')).not.toHaveStyle({
      visibility: 'hidden',
    });
    toggleOpen(container);
    expect(container.querySelector('.rc-select-selection-placeholder')).toHaveStyle({
      visibility: 'hidden',
    });
  });

  it('when value is null', () => {
    const { container } = render(<Select value={null} placeholder="bamboo" />);
    expect(container.querySelector('.rc-select-selection-placeholder')).toBeTruthy();
    expect(container.querySelector('.rc-select-selection-placeholder').textContent).toBe('bamboo');
  });

  it('not when value is null but it is an Option', () => {
    const { container } = render(
      <Select value={null} placeholder="bamboo" options={[{ value: null, label: 'light' }]} />,
    );
    expect(container.querySelector('.rc-select-selection-placeholder')).toBeFalsy();
    expect(container.querySelector('.rc-select-selection-item').textContent).toBe('light');
    toggleOpen(container);
    expect(container.querySelector('.rc-select-selection-item').textContent).toBe('light');
  });

  it('should hide placeholder if force closed and showSearch with searchValue', () => {
    const { container } = render(
      <Select showSearch searchValue="search" open={false} placeholder="placeholder" />,
    );
    expect(container.querySelector('.rc-select-selection-placeholder')).toHaveStyle({
      visibility: 'hidden',
    });
    expect(container.querySelector('.rc-select-selection-placeholder').textContent).toBe(
      'placeholder',
    );
  });
});
