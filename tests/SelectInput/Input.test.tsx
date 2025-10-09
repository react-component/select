import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Input from '../../src/SelectInput/Input';

describe('Input', () => {
  it('should render correctly', () => {
    const { container } = render(<Input prefixCls="test-input" />);
    expect(container.querySelector('input')).toBeTruthy();
  });

  it('should handle value changes', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <Input prefixCls="test-input" value="test" onChange={handleChange} />
    );
    const input = container.querySelector('input');
    
    fireEvent.change(input!, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('should apply className and style props', () => {
    const { container } = render(
      <Input 
        prefixCls="test-input" 
        className="custom-class" 
        style={{ color: 'red' }} 
      />
    );
    const input = container.querySelector('input');
    
    expect(input!.classList.contains('custom-class')).toBeTruthy();
    expect(input!.style.color).toBe('red');
  });

  it('should handle placeholder', () => {
    const { container } = render(
      <Input prefixCls="test-input" placeholder="Enter text" />
    );
    const input = container.querySelector('input');
    
    expect(input!.getAttribute('placeholder')).toBe('Enter text');
  });

  it('should handle disabled state', () => {
    const { container } = render(
      <Input prefixCls="test-input" disabled />
    );
    const input = container.querySelector('input');
    
    expect(input!.disabled).toBeTruthy();
  });
});
