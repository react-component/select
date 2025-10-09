import * as React from 'react';
import { render } from '@testing-library/react';
import useComponents from '../../src/hooks/useComponents';
import SelectInput from '../../src/SelectInput';

describe('useComponents', () => {
  it('should return SelectInput as default component', () => {
    const TestComponent = () => {
      const { Component } = useComponents();
      return <Component prefixCls="test" />;
    };
    
    const { container } = render(<TestComponent />);
    expect(container.querySelector('.test')).toBeTruthy();
  });

  it('should return custom component when provided', () => {
    const CustomComponent = () => <div className="custom-component">Custom</div>;
    
    const TestComponent = () => {
      const { Component } = useComponents({ root: CustomComponent });
      return <Component prefixCls="test" />;
    };
    
    const { container } = render(<TestComponent />);
    expect(container.querySelector('.custom-component')).toBeTruthy();
  });

  it('should memoize the component', () => {
    let renderCount = 0;
    
    const CustomComponent = () => {
      renderCount++;
      return <div>Custom</div>;
    };
    
    const TestComponent = (props: { components?: any }) => {
      const { Component } = useComponents(props.components);
      return <Component prefixCls="test" />;
    };
    
    const { rerender } = render(<TestComponent components={{ root: CustomComponent }} />);
    expect(renderCount).toBe(1);
    
    // Re-render with same component should not re-create
    rerender(<TestComponent components={{ root: CustomComponent }} />);
    expect(renderCount).toBe(1);
    
    // Re-render with different component should re-create
    const AnotherComponent = () => <div>Another</div>;
    rerender(<TestComponent components={{ root: AnotherComponent }} />);
    expect(renderCount).toBe(1); // Still 1 because we're using a different component
  });
});
