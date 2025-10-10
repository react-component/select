import * as React from 'react';
import { render } from '@testing-library/react';
import SelectContent from '../../src/SelectInput/Content';

describe('SelectContent', () => {
  it('should render SingleContent for single mode', () => {
    const { container } = render(
      <SelectContent
        prefixCls="rc-select"
        multiple={false}
        value={[{ value: 'test', label: 'Test' }]}
      />,
    );

    expect(container.querySelector('.rc-select-content')).toBeTruthy();
  });

  it('should render MultipleContent for multiple mode', () => {
    const { container } = render(
      <SelectContent
        prefixCls="rc-select"
        multiple={true}
        value={[
          { value: 'test1', label: 'Test 1' },
          { value: 'test2', label: 'Test 2' },
        ]}
      />,
    );

    expect(container.querySelector('.rc-select-content')).toBeTruthy();
  });

  it('should pass value to SingleContent', () => {
    const { container } = render(
      <SelectContent
        prefixCls="rc-select"
        multiple={false}
        value={[{ value: 'test', label: 'Test Label' }]}
      />,
    );

    const input = container.querySelector('input');
    expect(input?.value).toBe('Test Label');
  });

  it('should pass value to MultipleContent', () => {
    const { container } = render(
      <SelectContent
        prefixCls="rc-select"
        multiple={true}
        value={[
          { value: 'test1', label: 'Test 1' },
          { value: 'test2', label: 'Test 2' },
        ]}
      />,
    );

    const input = container.querySelector('input');
    expect(input?.value).toBe('Test 1, Test 2');
  });

  it('should handle empty values', () => {
    const { container } = render(
      <SelectContent prefixCls="rc-select" multiple={false} value={[]} />,
    );

    const input = container.querySelector('input');
    expect(input?.value).toBe('');
  });
});
