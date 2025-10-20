import React, { forwardRef } from 'react';
import { render } from '@testing-library/react';
import BaseSelect from '../src/BaseSelect';
import type { OptionListProps, RefOptionListProps } from '../src/OptionList';

const OptionList = forwardRef<RefOptionListProps, OptionListProps>(() => (
  <div className="popup">Popup</div>
));

describe('BaseSelect Semantic Styles', () => {
  const defaultProps = {
    prefixCls: 'rc-select',
    OptionList,
    displayValues: [],
    emptyOptions: true,
    id: 'test',
    onDisplayValuesChange: () => {},
    onSearch: () => {},
    searchValue: '',
  };

  it('should apply semantic classNames correctly', () => {
    const classNames = {
      prefix: 'custom-prefix',
      suffix: 'custom-suffix',
      input: 'custom-input',
      clear: 'custom-clear',
      placeholder: 'custom-placeholder',
      content: 'custom-content',
      item: 'custom-item',
      itemContent: 'custom-item-content',
      itemRemove: 'custom-item-remove',
    };

    const { container } = render(
      <BaseSelect
        {...defaultProps}
        classNames={classNames}
        placeholder="Test placeholder"
        prefix={<span>Prefix</span>}
        suffix={<span>Suffix</span>}
      />,
    );

    // Test prefix className
    expect(container.querySelector('.rc-select-prefix')).toHaveClass('custom-prefix');

    // Test suffix className
    expect(container.querySelector('.rc-select-suffix')).toHaveClass('custom-suffix');

    // Test input className
    expect(container.querySelector('.rc-select-input')).toHaveClass('custom-input');

    // Test content className
    expect(container.querySelector('.rc-select-content')).toHaveClass('custom-content');

    // Test placeholder className
    expect(container.querySelector('.rc-select-placeholder')).toHaveClass('custom-placeholder');
  });

  it('should apply semantic styles correctly', () => {
    const styles = {
      prefix: { color: 'red' },
      suffix: { color: 'blue' },
      input: { fontSize: '16px' },
      clear: { cursor: 'pointer' },
      placeholder: { opacity: 0.6 },
      content: { padding: '4px' },
      item: { margin: '2px' },
      itemContent: { fontWeight: 'bold' },
      itemRemove: { background: 'transparent' },
    };

    const { container } = render(
      <BaseSelect
        {...defaultProps}
        styles={styles}
        placeholder="Test placeholder"
        prefix={<span>Prefix</span>}
        suffix={<span>Suffix</span>}
      />,
    );

    // Test prefix style
    expect(container.querySelector('.rc-select-prefix')).toHaveStyle({ color: 'red' });

    // Test suffix style
    expect(container.querySelector('.rc-select-suffix')).toHaveStyle({ color: 'blue' });

    // Test input style
    expect(container.querySelector('.rc-select-input')).toHaveStyle({ fontSize: '16px' });

    // Test content style
    expect(container.querySelector('.rc-select-content')).toHaveStyle({ padding: '4px' });

    // Test placeholder style
    expect(container.querySelector('.rc-select-placeholder')).toHaveStyle({ opacity: 0.6 });
  });

  it('should apply item semantic styles in multiple mode', () => {
    const classNames = {
      item: 'custom-item',
      itemContent: 'custom-item-content',
      itemRemove: 'custom-item-remove',
    };

    const styles = {
      item: { margin: '2px' },
      itemContent: { fontWeight: 'bold' },
      itemRemove: { background: 'transparent' },
    };

    const displayValues = [
      { key: '1', label: 'Option 1', value: '1' },
      { key: '2', label: 'Option 2', value: '2' },
    ];

    const { container } = render(
      <BaseSelect
        {...defaultProps}
        mode="multiple"
        displayValues={displayValues}
        classNames={classNames}
        styles={styles}
      />,
    );

    // Test item className and style
    const items = container.querySelectorAll('.rc-select-selection-item');
    expect(items[0]).toHaveClass('custom-item');
    expect(items[0]).toHaveStyle({ margin: '2px' });

    // Test item content className and style
    const itemContents = container.querySelectorAll('.rc-select-selection-item-content');
    expect(itemContents[0]).toHaveClass('custom-item-content');
    expect(itemContents[0]).toHaveStyle({ fontWeight: 'bold' });

    // Test item remove className and style
    const removeButtons = container.querySelectorAll('.rc-select-selection-item-remove');
    expect(removeButtons[0]).toHaveClass('custom-item-remove');
    expect(removeButtons[0]).toHaveStyle({ background: 'transparent' });
  });

  it('should apply clear icon semantic styles when allowClear is enabled', () => {
    const classNames = {
      clear: 'custom-clear',
    };

    const styles = {
      clear: { cursor: 'pointer' },
    };

    const { container } = render(
      <BaseSelect
        {...defaultProps}
        displayValues={[{ key: '1', label: 'Option 1', value: '1' }]}
        allowClear
        classNames={classNames}
        styles={styles}
      />,
    );

    // Test clear icon className and style
    const clearIcon = container.querySelector('.rc-select-clear');
    expect(clearIcon).toHaveClass('custom-clear');
    expect(clearIcon).toHaveStyle({ cursor: 'pointer' });
  });
});
